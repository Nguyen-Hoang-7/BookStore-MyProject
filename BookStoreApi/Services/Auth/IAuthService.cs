// Services/Auth/IAuthService.cs
using BookStoreApi.DTOs.Auth;

namespace BookStoreApi.Services.Auth;

public interface IAuthService
{
    Task<ServiceResult<AuthResponseDTO>> RegisterAsync(RegisterDTO dto);
    Task<ServiceResult<AuthResponseDTO>> LoginAsync(LoginDTO dto);
}