// Controllers/Admin/AdminUploadController.cs
using BookStoreApi.Services.Upload;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers.Admin;

[ApiController]
[Route("api/admin/upload")]
[Authorize(Roles = "Admin")]
public class AdminUploadController : BaseApiController
{
    private readonly IUploadService _uploadService;

    public AdminUploadController(IUploadService uploadService) => _uploadService = uploadService;

    [HttpPost("image")]
    public IActionResult UploadImage(IFormFile file)
    {
        var result = _uploadService.SaveImage(file);
        if (result.Errors.Count > 0)
        {
            return BadRequest(new
            {
                message = "Một hoặc nhiều ảnh không thể tải lên.",
                errors = result.Errors,
                uploaded = result.Uploaded
            });
        }
        return result.Success ? Ok(result.Data) : ToErrorResponse(result);
    }

    [HttpPost("images")]
    public IActionResult UploadImages(List<IFormFile> files)
    {
        var result = _uploadService.SaveImages(files);
        return result.Success ? Ok(result.Data) : ToErrorResponse(result);
    }
}