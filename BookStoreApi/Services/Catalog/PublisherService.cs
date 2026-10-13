// Services/Catalog/PublisherService.cs
using BookStoreApi.Data;
using BookStoreApi.DTOs.Admin;
using BookStoreApi.DTOs.Catalog;
using BookStoreApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BookStoreApi.Services.Catalog;

public class PublisherService : IPublisherService
{
    private readonly AppDbContext _db;

    public PublisherService(AppDbContext db) => _db = db;

    public async Task<ServiceResult<List<PublisherDTO>>> GetAllAsync()
    {
        var items = await _db.Publishers
            .AsNoTracking()
            .OrderBy(p => p.Name)
            .Select(p => p.ToDto())
            .ToListAsync();

        return ServiceResult<List<PublisherDTO>>.Ok(items);
    }

    public async Task<ServiceResult<PublisherDTO>> GetByIdAsync(int id)
    {
        var publisher = await _db.Publishers.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
        if (publisher is null)
            return ServiceResult<PublisherDTO>.Fail("Không tìm thấy nhà xuất bản.", ServiceErrorType.NotFound);

        return ServiceResult<PublisherDTO>.Ok(publisher.ToDto());
    }

    public async Task<ServiceResult<PublisherDTO>> CreateAsync(CreatePublisherDTO dto)
    {
        var name = dto.Name.Trim();
        if (await _db.Publishers.AnyAsync(p => p.Name == name))
            return ServiceResult<PublisherDTO>.Fail("Tên nhà xuất bản đã tồn tại.", ServiceErrorType.Conflict);

        var publisher = new Publisher
        {
            Name = name,
            Address = dto.Address,
            PhoneNumber = dto.PhoneNumber
        };

        _db.Publishers.Add(publisher);
        await _db.SaveChangesAsync();

        return ServiceResult<PublisherDTO>.Ok(publisher.ToDto());
    }

    public async Task<ServiceResult<PublisherDTO>> UpdateAsync(int id, UpdatePublisherDTO dto)
    {
        var publisher = await _db.Publishers.FindAsync(id);
        if (publisher is null)
            return ServiceResult<PublisherDTO>.Fail("Không tìm thấy nhà xuất bản.", ServiceErrorType.NotFound);

        var name = dto.Name.Trim();
        if (await _db.Publishers.AnyAsync(p => p.Name == name && p.Id != id))
            return ServiceResult<PublisherDTO>.Fail("Tên nhà xuất bản đã tồn tại.", ServiceErrorType.Conflict);

        publisher.Name = name;
        publisher.Address = dto.Address;
        publisher.PhoneNumber = dto.PhoneNumber;

        await _db.SaveChangesAsync();
        return ServiceResult<PublisherDTO>.Ok(publisher.ToDto());
    }

    public async Task<ServiceResult<bool>> DeleteAsync(int id)
    {
        var publisher = await _db.Publishers
            .Include(p => p.BookDetails)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (publisher is null)
            return ServiceResult<bool>.Fail("Không tìm thấy nhà xuất bản.", ServiceErrorType.NotFound);

        if (publisher.BookDetails.Count > 0)
            return ServiceResult<bool>.Fail(
                $"Không thể xóa vì còn {publisher.BookDetails.Count} sách thuộc nhà xuất bản này.",
                ServiceErrorType.Conflict);

        _db.Publishers.Remove(publisher);
        await _db.SaveChangesAsync();
        return ServiceResult<bool>.Ok(true);
    }
}