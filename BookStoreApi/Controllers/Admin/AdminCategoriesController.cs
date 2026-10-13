// Controllers/Admin/AdminCategoriesController.cs
using BookStoreApi.DTOs.Admin;
using BookStoreApi.Services.Catalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers.Admin;

[ApiController]
[Route("api/admin/categories")]
[Authorize(Roles = "Admin")]
public class AdminCategoriesController : BaseApiController
{
    private readonly ICategoryService _categoryService;

    public AdminCategoriesController(ICategoryService categoryService) => _categoryService = categoryService;

    [HttpPost]
    public async Task<IActionResult> Create(CreateCategoryDTO dto)
    {
        var result = await _categoryService.CreateAsync(dto);
        return result.Success ? Ok(result.Data) : ToErrorResponse(result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateCategoryDTO dto)
    {
        var result = await _categoryService.UpdateAsync(id, dto);
        return result.Success ? Ok(result.Data) : ToErrorResponse(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _categoryService.DeleteAsync(id);
        return result.Success ? NoContent() : ToErrorResponse(result);
    }
}