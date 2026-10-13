// Services/ITokenService.cs
using BookStoreApi.DTOs.Auth;
using BookStoreApi.Models;

namespace BookStoreApi.Services;

public interface ITokenService
{
    AuthResponseDTO CreateToken(User user);
}