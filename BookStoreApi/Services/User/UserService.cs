// Services/Users/UserService.cs
using BookStoreApi.Data;
using BookStoreApi.DTOs.User;

namespace BookStoreApi.Services.Users;

public class UserService : IUserService
{
    private readonly AppDbContext _db;

    public UserService(AppDbContext db) => _db = db;

    public async Task<ServiceResult<UserDTO>> GetMeAsync(int userId)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user is null) return ServiceResult<UserDTO>.Fail("Không tìm thấy user.", ServiceErrorType.NotFound);
        return ServiceResult<UserDTO>.Ok(user.ToDTO());
    }

    public async Task<ServiceResult<UserDTO>> UpdateProfileAsync(int userId, UpdateProfileDTO dto)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user is null) return ServiceResult<UserDTO>.Fail("Không tìm thấy user.", ServiceErrorType.NotFound);

        user.FullName = dto.FullName.Trim();
        user.PhoneNumber = dto.PhoneNumber ?? string.Empty;
        user.Address = dto.Address ?? string.Empty;
        user.AvatarUrl = dto.AvatarUrl;
        user.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return ServiceResult<UserDTO>.Ok(user.ToDTO());
    }

    public async Task<ServiceResult<bool>> ChangePasswordAsync(int userId, ChangePasswordDTO dto)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user is null) return ServiceResult<bool>.Fail("Không tìm thấy user.", ServiceErrorType.NotFound);

        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
            return ServiceResult<bool>.Fail("Mật khẩu hiện tại không đúng.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return ServiceResult<bool>.Ok(true);
    }
}