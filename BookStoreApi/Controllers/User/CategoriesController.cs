// Controllers/User/CategoriesController.cs
using BookStoreApi.Models;
using BookStoreApi.Services.Catalog;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers.User;

[ApiController]
[Route("api/categories")]
public class CategoriesController : BaseApiController
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService) => _categoryService = categoryService;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] CategoryType? type)
    {
        var result = await _categoryService.GetAllAsync(type);
        return result.Success ? Ok(result.Data) : ToErrorResponse(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _categoryService.GetByIdAsync(id);
        return result.Success ? Ok(result.Data) : ToErrorResponse(result);
    }
}