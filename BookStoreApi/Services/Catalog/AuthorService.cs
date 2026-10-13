// Services/Catalog/AuthorService.cs
using BookStoreApi.Data;
using BookStoreApi.DTOs.Admin;
using BookStoreApi.DTOs.Catalog;
using BookStoreApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BookStoreApi.Services.Catalog;

public class AuthorService : IAuthorService
{
    private readonly AppDbContext _db;

    public AuthorService(AppDbContext db) => _db = db;

    public async Task<ServiceResult<List<AuthorDTO>>> GetAllAsync(string? q = null)
    {
        var query = _db.Authors.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(q))
            query = query.Where(a => a.Name.Contains(q));

        var items = await query
            .OrderBy(a => a.Name)
            .Select(a => a.ToDto())
            .ToListAsync();

        return ServiceResult<List<AuthorDTO>>.Ok(items);
    }

    public async Task<ServiceResult<AuthorDTO>> GetByIdAsync(int id)
    {
        var author = await _db.Authors.AsNoTracking().FirstOrDefaultAsync(a => a.Id == id);
        if (author is null)
            return ServiceResult<AuthorDTO>.Fail("Không tìm thấy tác giả.", ServiceErrorType.NotFound);

        return ServiceResult<AuthorDTO>.Ok(author.ToDto());
    }

    public async Task<ServiceResult<AuthorDTO>> CreateAsync(CreateAuthorDTO dto)
    {
        var author = new Author
        {
            Name = dto.Name.Trim(),
            Biography = dto.Biography,
            AvatarUrl = dto.AvatarUrl
        };

        _db.Authors.Add(author);
        await _db.SaveChangesAsync();

        return ServiceResult<AuthorDTO>.Ok(author.ToDto());
    }

    public async Task<ServiceResult<AuthorDTO>> UpdateAsync(int id, UpdateAuthorDTO dto)
    {
        var author = await _db.Authors.FindAsync(id);
        if (author is null)
            return ServiceResult<AuthorDTO>.Fail("Không tìm thấy tác giả.", ServiceErrorType.NotFound);

        author.Name = dto.Name.Trim();
        author.Biography = dto.Biography;
        author.AvatarUrl = dto.AvatarUrl;

        await _db.SaveChangesAsync();
        return ServiceResult<AuthorDTO>.Ok(author.ToDto());
    }

    public async Task<ServiceResult<bool>> DeleteAsync(int id)
    {
        var author = await _db.Authors
            .Include(a => a.BookDetails)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (author is null)
            return ServiceResult<bool>.Fail("Không tìm thấy tác giả.", ServiceErrorType.NotFound);

        if (author.BookDetails.Count > 0)
            return ServiceResult<bool>.Fail(
                $"Không thể xóa vì tác giả còn gắn với {author.BookDetails.Count} sách.",
                ServiceErrorType.Conflict);

        _db.Authors.Remove(author);
        await _db.SaveChangesAsync();
        return ServiceResult<bool>.Ok(true);
    }
}