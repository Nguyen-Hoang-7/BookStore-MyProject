// Controllers/Admin/AdminAuthorsController.cs
using BookStoreApi.DTOs.Admin;
using BookStoreApi.Services.Catalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers.Admin;

[ApiController]
[Route("api/admin/authors")]
[Authorize(Roles = "Admin")]
public class AdminAuthorsController : BaseApiController
{
    private readonly IAuthorService _authorService;

    public AdminAuthorsController(IAuthorService authorService) => _authorService = authorService;

    [HttpPost]
    public async Task<IActionResult> Create(CreateAuthorDTO dto)
    {
        var result = await _authorService.CreateAsync(dto);
        return result.Success ? Ok(result.Data) : ToErrorResponse(result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateAuthorDTO dto)
    {
        var result = await _authorService.UpdateAsync(id, dto);
        return result.Success ? Ok(result.Data) : ToErrorResponse(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _authorService.DeleteAsync(id);
        return result.Success ? NoContent() : ToErrorResponse(result);
    }
}