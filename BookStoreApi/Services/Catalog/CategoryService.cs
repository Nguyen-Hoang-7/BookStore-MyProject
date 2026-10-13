// Services/Catalog/CategoryService.cs
using BookStoreApi.Data;
using BookStoreApi.DTOs.Admin;
using BookStoreApi.DTOs.Catalog;
using BookStoreApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BookStoreApi.Services.Catalog;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _db;

    public CategoryService(AppDbContext db) => _db = db;

    public async Task<ServiceResult<List<CategoryDTO>>> GetAllAsync(CategoryType? type = null)
    {
        var query = _db.Categories.AsNoTracking().Where(c => c.IsActive);

        if (type is not null)
            query = query.Where(c => c.Type == type);

        var items = await query
            .OrderBy(c => c.Name)
            .Select(c => new CategoryDTO
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Description = c.Description,
                Type = c.Type,
                ProductCount = c.Products.Count
            })
            .ToListAsync();

        return ServiceResult<List<CategoryDTO>>.Ok(items);
    }

    public async Task<ServiceResult<CategoryDTO>> GetByIdAsync(int id)
    {
        var category = await _db.Categories
            .AsNoTracking()
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category is null)
            return ServiceResult<CategoryDTO>.Fail("Không tìm thấy thể loại.", ServiceErrorType.NotFound);

        return ServiceResult<CategoryDTO>.Ok(category.ToDto());
    }

    public async Task<ServiceResult<CategoryDTO>> CreateAsync(CreateCategoryDTO dto)
    {
        var name = dto.Name.Trim();

        if (await _db.Categories.AnyAsync(c => c.Name == name))
            return ServiceResult<CategoryDTO>.Fail("Tên thể loại đã tồn tại.", ServiceErrorType.Conflict);

        var slug = await GenerateUniqueSlugAsync(name);

        var category = new Category
        {
            Name = name,
            Slug = slug,
            Description = dto.Description,
            Type = dto.Type
        };

        _db.Categories.Add(category);
        await _db.SaveChangesAsync();

        return ServiceResult<CategoryDTO>.Ok(category.ToDto());
    }

    public async Task<ServiceResult<CategoryDTO>> UpdateAsync(int id, UpdateCategoryDTO dto)
    {
        var category = await _db.Categories.FindAsync(id);
        if (category is null)
            return ServiceResult<CategoryDTO>.Fail("Không tìm thấy thể loại.", ServiceErrorType.NotFound);

        var name = dto.Name.Trim();
        if (await _db.Categories.AnyAsync(c => c.Name == name && c.Id != id))
            return ServiceResult<CategoryDTO>.Fail("Tên thể loại đã tồn tại.", ServiceErrorType.Conflict);

        // Chỉ sinh lại slug nếu tên thay đổi, tránh đổi URL không cần thiết
        if (category.Name != name)
            category.Slug = await GenerateUniqueSlugAsync(name, excludeId: id);

        category.Name = name;
        category.Description = dto.Description;
        category.Type = dto.Type;
        category.IsActive = dto.IsActive;

        await _db.SaveChangesAsync();
        return ServiceResult<CategoryDTO>.Ok(category.ToDto());
    }

    public async Task<ServiceResult<bool>> DeleteAsync(int id)
    {
        var category = await _db.Categories
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category is null)
            return ServiceResult<bool>.Fail("Không tìm thấy thể loại.", ServiceErrorType.NotFound);

        if (category.Products.Count > 0)
            return ServiceResult<bool>.Fail(
                $"Không thể xóa vì còn {category.Products.Count} sản phẩm thuộc thể loại này.",
                ServiceErrorType.Conflict);

        _db.Categories.Remove(category);
        await _db.SaveChangesAsync();
        return ServiceResult<bool>.Ok(true);
    }

    // Đảm bảo slug không trùng: "van-hoc" -> nếu đã tồn tại thì "van-hoc-2", "van-hoc-3"...
    private async Task<string> GenerateUniqueSlugAsync(string name, int? excludeId = null)
    {
        var baseSlug = name.ToSlug();
        var slug = baseSlug;
        var counter = 2;

        while (await _db.Categories.AnyAsync(c => c.Slug == slug && c.Id != excludeId))
        {
            slug = $"{baseSlug}-{counter}";
            counter++;
        }

        return slug;
    }
}