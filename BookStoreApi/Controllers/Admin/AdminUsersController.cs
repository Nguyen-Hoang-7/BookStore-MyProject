using System.Security.Claims;
using BookStoreApi.DTOs.Admin;
using BookStoreApi.Services.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers.Admin;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "Admin")]
public class AdminUsersController : BaseApiController
{
    private readonly IAdminUserService _adminUserService;

    public AdminUsersController(IAdminUserService adminUserService) => _adminUserService = adminUserService;

    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll(string? q, int page = 1, int pageSize = 20)
    {
        var result = await _adminUserService.GetAllAsync(q, page, pageSize);
        return Ok(result.Data);
    }

    [HttpPut("{id:int}/lock")]
    public async Task<IActionResult> Lock(int id)
    {
        var result = await _adminUserService.LockAsync(id, CurrentUserId);
        return result.Success ? NoContent() : ToErrorResponse(result);
    }

    [HttpPut("{id:int}/unlock")]
    public async Task<IActionResult> Unlock(int id)
    {
        var result = await _adminUserService.UnlockAsync(id);
        return result.Success ? NoContent() : ToErrorResponse(result);
    }

    [HttpPut("{id:int}/role")]
    public async Task<IActionResult> SetRole(int id, AdminUpdateRoleDTO dto)
    {
        var result = await _adminUserService.SetRoleAsync(id, CurrentUserId, dto);
        return result.Success ? NoContent() : ToErrorResponse(result);
    }
}