// Services/Catalog/ProductService.cs
using BookStoreApi.Data;
using BookStoreApi.DTOs.Admin;
using BookStoreApi.DTOs.Catalog;
using BookStoreApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BookStoreApi.Services.Catalog;

public class ProductService : IProductService
{
    private readonly AppDbContext _db;
    private readonly IUploadService _uploadService;

    public ProductService(AppDbContext db, IUploadService uploadService)
    {
        _db = db;
        _uploadService = uploadService;
    }

    private IQueryable<Product> BaseQuery() =>
        _db.Products
            .Include(p => p.Category)
            .Include(p => p.BookDetail!).ThenInclude(bd => bd!.Publisher)
            .Include(p => p.BookDetail!).ThenInclude(bd => bd!.Authors);

    public async Task<ServiceResult<object>> SearchAsync(string? q, int? categoryId, int page, int pageSize, bool includeInactive = false)
    {
        var query = BaseQuery().AsNoTracking();

        if (!includeInactive)
            query = query.Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(q))
            query = query.Where(p => p.Name.Contains(q));

        if (categoryId is not null)
            query = query.Where(p => p.CategoryId == categoryId);

        var total = await query.CountAsync();
        var items = await query
            .OrderBy(p => p.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();   // lấy entity về trước, map DTO sau (ToDto không dịch được sang SQL)

        return ServiceResult<object>.Ok(new
        {
            total,
            page,
            pageSize,
            items = items.Select(p => p.ToDto()).ToList()
        });
    }

    public async Task<ServiceResult<ProductDTO>> GetByIdAsync(int id)
    {
        var product = await BaseQuery().AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
        if (product is null)
            return ServiceResult<ProductDTO>.Fail("Không tìm thấy sản phẩm.", ServiceErrorType.NotFound);

        return ServiceResult<ProductDTO>.Ok(product.ToDto());
    }

    public async Task<ServiceResult<ProductDTO>> CreateAsync(CreateProductDTO dto)
    {
        var category = await _db.Categories.FindAsync(dto.CategoryId);
        if (category is null)
            return ServiceResult<ProductDTO>.Fail("Danh mục không tồn tại.", ServiceErrorType.NotFound);

        var name = dto.Name.Trim();
        var slug = await GenerateUniqueSlugAsync(name);

        var product = new Product
        {
            Name = name,
            Slug = slug,
            Description = dto.Description,
            Price = dto.Price,
            Stock = dto.Stock,
            ImageUrls = dto.ImageUrls,
            CategoryId = dto.CategoryId
        };

        // Chỉ gắn BookDetail nếu Category thuộc nhóm Sách
        if (category.Type == CategoryType.Book && dto.BookDetail is not null)
        {
            var bookDetailResult = await BuildBookDetailAsync(dto.BookDetail);
            if (!bookDetailResult.Success)
                return ServiceResult<ProductDTO>.Fail(bookDetailResult.ErrorMessage!, bookDetailResult.ErrorType);

            product.BookDetail = bookDetailResult.Data;
        }

        _db.Products.Add(product);
        await _db.SaveChangesAsync();

        return await GetByIdAsync(product.Id);
    }

    public async Task<ServiceResult<ProductDTO>> UpdateAsync(int id, UpdateProductDTO dto)
    {
        var product = await _db.Products
            .Include(p => p.BookDetail)
            .ThenInclude(bd => bd.Authors) // Bắt buộc Include để EF track bảng trung gian
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product is null)
            return ServiceResult<ProductDTO>.Fail("Không tìm thấy sản phẩm.", ServiceErrorType.NotFound);

        var category = await _db.Categories.FindAsync(dto.CategoryId);
        if (category is null)
            return ServiceResult<ProductDTO>.Fail("Danh mục không tồn tại.", ServiceErrorType.NotFound);

        var name = dto.Name.Trim();
        if (product.Name != name)
            product.Slug = await GenerateUniqueSlugAsync(name, excludeId: id);

        product.Name = name;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.Stock = dto.Stock;
        product.ImageUrls = dto.ImageUrls;
        product.CategoryId = dto.CategoryId;
        product.IsActive = dto.IsActive;
        product.UpdatedAt = DateTime.UtcNow;

        if (category.Type == CategoryType.Book && dto.BookDetail is not null)
        {
            var bookDetailResult = await BuildBookDetailAsync(dto.BookDetail, existing: product.BookDetail);
            if (!bookDetailResult.Success)
                return ServiceResult<ProductDTO>.Fail(bookDetailResult.ErrorMessage!, bookDetailResult.ErrorType);

            product.BookDetail = bookDetailResult.Data;
        }
        else if (category.Type != CategoryType.Book)
        {
            // Đổi Category sang nhóm "Khác" thì gỡ bỏ BookDetail cũ (nếu có)
            if (product.BookDetail is not null)
                _db.BookDetails.Remove(product.BookDetail);
        }

        // Lọc ra danh sách ảnh cũ bị loại bỏ khỏi danh sách ảnh mới
        var removedImages = product.ImageUrls
            .Except(dto.ImageUrls ?? new List<string>(), StringComparer.OrdinalIgnoreCase)
            .ToList();

        // Gán danh sách ảnh mới như bình thường
        product.ImageUrls = dto.ImageUrls ?? new List<string>();
        // ... (cập nhật các trường khác và BookDetail)

        await _db.SaveChangesAsync();

        // Chỉ xóa file vật lý SAU KHI đã lưu Database thành công!
        if (removedImages.Count > 0)
        {
            _uploadService.DeleteFiles(removedImages);
        }

        return await GetByIdAsync(product.Id);

        // await _db.SaveChangesAsync();
        // return await GetByIdAsync(product.Id);
    }

    public async Task<ServiceResult<bool>> DeleteAsync(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product is null)
            return ServiceResult<bool>.Fail("Không tìm thấy sản phẩm.", ServiceErrorType.NotFound);

        var imagesToDelete = product.ImageUrls.ToList();

        _db.Products.Remove(product);   // BookDetail tự xóa theo nhờ Cascade

        // Xóa toàn bộ ảnh vật lý của sách sau khi xóa khỏi DB
        _uploadService.DeleteFiles(imagesToDelete);

        await _db.SaveChangesAsync();
        return ServiceResult<bool>.Ok(true);
    }

    // Tạo hoặc cập nhật BookDetail dùng chung cho cả Create và Update
    private async Task<ServiceResult<BookDetail>> BuildBookDetailAsync(
        CreateBookDetailDTO dto, BookDetail? existing = null)
    {
        if (!string.IsNullOrWhiteSpace(dto.Isbn))
        {
            var isbnTaken = await _db.BookDetails.AnyAsync(bd =>
                bd.Isbn == dto.Isbn && (existing == null || bd.ProductId != existing.ProductId));

            if (isbnTaken)
                return ServiceResult<BookDetail>.Fail("ISBN đã tồn tại.", ServiceErrorType.Conflict);
        }

        var bookDetail = existing ?? new BookDetail();
        bookDetail.Isbn = dto.Isbn;
        bookDetail.Pages = dto.Pages;
        bookDetail.Language = dto.Language;
        bookDetail.PublishedDate = dto.PublishedDate;
        bookDetail.PublisherId = dto.PublisherId;

        if (dto.AuthorIds.Count > 0)
        {
            var authors = await _db.Authors
                .Where(a => dto.AuthorIds.Contains(a.Id))
                .ToListAsync();

            if (authors.Count != dto.AuthorIds.Count)
                return ServiceResult<BookDetail>.Fail("Có tác giả không tồn tại trong hệ thống.", ServiceErrorType.NotFound);

            bookDetail.Authors = authors;
        }
        else
        {
            bookDetail.Authors.Clear(); // Xóa toàn bộ tác giả nếu truyền mảng rỗng
        }

        return ServiceResult<BookDetail>.Ok(bookDetail);
    }

    private async Task<string> GenerateUniqueSlugAsync(string name, int? excludeId = null)
    {
        var baseSlug = name.ToSlug();
        var slug = baseSlug;
        var counter = 2;

        while (await _db.Products.AnyAsync(p => p.Slug == slug && p.Id != excludeId))
        {
            slug = $"{baseSlug}-{counter}";
            counter++;
        }

        return slug;
    }
}