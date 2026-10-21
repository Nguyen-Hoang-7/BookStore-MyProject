// Services/Upload/IUploadService.cs
using BookStoreApi.DTOs.Admin;
using Microsoft.AspNetCore.Http;

namespace BookStoreApi.Services.Upload;

public interface IUploadService
{
    ServiceResult<UploadResultDTO> SaveImage(IFormFile file);
    UploadMultipleResultDTO SaveImages(List<IFormFile> files);
    void DeleteFiles(IEnumerable<string> relativeUrls); // <-- Thêm dòng này
}