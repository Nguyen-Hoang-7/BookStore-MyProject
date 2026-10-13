// Services/Users/IUserService.cs
using BookStoreApi.DTOs.User;

namespace BookStoreApi.Services.Users;

public interface IUserService
{
    Task<ServiceResult<UserDTO>> GetMeAsync(int userId);
    Task<ServiceResult<UserDTO>> UpdateProfileAsync(int userId, UpdateProfileDTO dto);
    Task<ServiceResult<bool>> ChangePasswordAsync(int userId, ChangePasswordDTO dto);
}