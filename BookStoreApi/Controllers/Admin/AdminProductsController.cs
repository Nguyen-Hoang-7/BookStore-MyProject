// Controllers/Admin/AdminProductsController.cs
using BookStoreApi.DTOs.Admin;
using BookStoreApi.Services.Catalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers.Admin;

[ApiController]
[Route("api/admin/products")]
[Authorize(Roles = "Admin")]
public class AdminProductsController : BaseApiController
{
    private readonly IProductService _productService;

    public AdminProductsController(IProductService productService) => _productService = productService;

    [HttpPost]
    public async Task<IActionResult> Create(CreateProductDTO dto)
    {
        var result = await _productService.CreateAsync(dto);
        return result.Success ? Ok(result.Data) : ToErrorResponse(result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateProductDTO dto)
    {
        var result = await _productService.UpdateAsync(id, dto);
        return result.Success ? Ok(result.Data) : ToErrorResponse(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _productService.DeleteAsync(id);
        return result.Success ? NoContent() : ToErrorResponse(result);
    }
}