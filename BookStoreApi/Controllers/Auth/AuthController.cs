using BookStoreApi.DTOs.Auth;
using BookStoreApi.Services.Auth;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers.Auth;

[ApiController]
[Route("api/auth")]
public class AuthController : BaseApiController
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService) => _authService = authService;

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDTO dto)
    {
        var result = await _authService.RegisterAsync(dto);
        return result.Success ? Ok(result.Data) : ToErrorResponse(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDTO dto)
    {
        var result = await _authService.LoginAsync(dto);
        return result.Success ? Ok(result.Data) : ToErrorResponse(result);
    }
}