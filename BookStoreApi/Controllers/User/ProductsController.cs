// Controllers/User/ProductsController.cs
using BookStoreApi.Services.Catalog;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers.User;

[ApiController]
[Route("api/products")]
public class ProductsController : BaseApiController
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService) => _productService = productService;

    [HttpGet]
    public async Task<IActionResult> Search(
        [FromQuery] string? q,
        [FromQuery] int? categoryId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12)
    {
        var result = await _productService.SearchAsync(q, categoryId, page, pageSize);
        return result.Success
        ? Ok(result.Data)
        : ToErrorResponse(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _productService.GetByIdAsync(id);
        return result.Success ? Ok(result.Data) : ToErrorResponse(result);
    }
}