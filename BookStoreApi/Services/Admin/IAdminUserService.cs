// Services/Admin/IAdminUserService.cs
using BookStoreApi.DTOs.Admin;

namespace BookStoreApi.Services.Admin;

public interface IAdminUserService
{
    Task<ServiceResult<object>> GetAllAsync(string? q, int page, int pageSize);
    Task<ServiceResult<bool>> LockAsync(int targetUserId, int currentAdminId);
    Task<ServiceResult<bool>> UnlockAsync(int targetUserId);
    Task<ServiceResult<bool>> SetRoleAsync(int targetUserId, int currentAdminId, AdminUpdateRoleDTO dto);
}