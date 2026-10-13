using System.Security.Claims;
using BookStoreApi.DTOs.User;
using BookStoreApi.Services.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers.User;

[ApiController]
[Route("api/user")]
[Authorize]
public class UsersController : BaseApiController
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService) => _userService = userService;

    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var result = await _userService.GetMeAsync(CurrentUserId);
        return result.Success ? Ok(result.Data) : ToErrorResponse(result);
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateMe(UpdateProfileDTO dto)
    {
        var result = await _userService.UpdateProfileAsync(CurrentUserId, dto);
        return result.Success ? Ok(result.Data) : ToErrorResponse(result);
    }

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordDTO dto)
    {
        var result = await _userService.ChangePasswordAsync(CurrentUserId, dto);
        return result.Success ? NoContent() : ToErrorResponse(result);
    }
}