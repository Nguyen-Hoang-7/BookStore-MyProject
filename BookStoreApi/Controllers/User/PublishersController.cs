// Controllers/User/PublishersController.cs
using BookStoreApi.Services.Catalog;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers.User;

[ApiController]
[Route("api/publishers")]
public class PublishersController : BaseApiController
{
    private readonly IPublisherService _publisherService;

    public PublishersController(IPublisherService publisherService) => _publisherService = publisherService;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _publisherService.GetAllAsync();
        return Ok(result.Data);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _publisherService.GetByIdAsync(id);
        return result.Success ? Ok(result.Data) : ToErrorResponse(result);
    }
}