// DTOs/Auth/AuthResponseDto.cs
using BookStoreApi.DTOs.User;

namespace BookStoreApi.DTOs.Auth;

public class AuthResponseDTO
{
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public UserDTO User { get; set; } = null!;
}