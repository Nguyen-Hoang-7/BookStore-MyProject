// Controllers/User/AuthorsController.cs
using BookStoreApi.Services.Catalog;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers.User;

[ApiController]
[Route("api/authors")]
public class AuthorsController : BaseApiController
{
    private readonly IAuthorService _authorService;

    public AuthorsController(IAuthorService authorService) => _authorService = authorService;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? q)
    {
        var result = await _authorService.GetAllAsync(q);
        return Ok(result.Data);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _authorService.GetByIdAsync(id);
        return result.Success ? Ok(result.Data) : ToErrorResponse(result);
    }
}