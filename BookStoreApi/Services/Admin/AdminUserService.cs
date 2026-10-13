// Services/Admin/AdminUserService.cs
using BookStoreApi.Data;
using BookStoreApi.DTOs.Admin;
using Microsoft.EntityFrameworkCore;

namespace BookStoreApi.Services.Admin;

public class AdminUserService : IAdminUserService
{
    private readonly AppDbContext _db;

    public AdminUserService(AppDbContext db) => _db = db;

    public async Task<ServiceResult<object>> GetAllAsync(string? q, int page, int pageSize)
    {
        var query = _db.Users.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(q))
            query = query.Where(u => u.Email.Contains(q) || u.FullName.Contains(q));

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => u.ToListItemDTO())
            .ToListAsync();

        return ServiceResult<object>.Ok(new { total, page, pageSize, items });
    }

    public async Task<ServiceResult<bool>> LockAsync(int targetUserId, int currentAdminId)
    {
        if (targetUserId == currentAdminId)
            return ServiceResult<bool>.Fail("Không thể tự khóa tài khoản của mình.");

        var user = await _db.Users.FindAsync(targetUserId);
        if (user is null) return ServiceResult<bool>.Fail("Không tìm thấy user.", ServiceErrorType.NotFound);

        user.IsActive = false;
        user.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return ServiceResult<bool>.Ok(true);
    }

    public async Task<ServiceResult<bool>> UnlockAsync(int targetUserId)
    {
        var user = await _db.Users.FindAsync(targetUserId);
        if (user is null) return ServiceResult<bool>.Fail("Không tìm thấy user.", ServiceErrorType.NotFound);

        user.IsActive = true;
        user.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return ServiceResult<bool>.Ok(true);
    }

    public async Task<ServiceResult<bool>> SetRoleAsync(int targetUserId, int currentAdminId, AdminUpdateRoleDTO dto)
    {
        if (dto.Role is not ("Admin" or "Customer"))
            return ServiceResult<bool>.Fail("Vai trò không hợp lệ.");

        if (targetUserId == currentAdminId)
            return ServiceResult<bool>.Fail("Không thể tự đổi vai trò của mình.");

        var user = await _db.Users.FindAsync(targetUserId);
        if (user is null) return ServiceResult<bool>.Fail("Không tìm thấy user.", ServiceErrorType.NotFound);

        user.Role = dto.Role;
        user.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return ServiceResult<bool>.Ok(true);
    }
}