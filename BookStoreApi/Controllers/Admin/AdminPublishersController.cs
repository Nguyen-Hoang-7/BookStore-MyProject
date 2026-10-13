// Controllers/Admin/AdminPublishersController.cs
using BookStoreApi.DTOs.Admin;
using BookStoreApi.Services.Catalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers.Admin;

[ApiController]
[Route("api/admin/publishers")]
[Authorize(Roles = "Admin")]
public class AdminPublishersController : BaseApiController
{
    private readonly IPublisherService _publisherService;

    public AdminPublishersController(IPublisherService publisherService) => _publisherService = publisherService;

    [HttpPost]
    public async Task<IActionResult> Create(CreatePublisherDTO dto)
    {
        var result = await _publisherService.CreateAsync(dto);
        return result.Success ? Ok(result.Data) : ToErrorResponse(result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdatePublisherDTO dto)
    {
        var result = await _publisherService.UpdateAsync(id, dto);
        return result.Success ? Ok(result.Data) : ToErrorResponse(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _publisherService.DeleteAsync(id);
        return result.Success ? NoContent() : ToErrorResponse(result);
    }
}