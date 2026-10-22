// Services/Upload/UploadService.cs
using BookStoreApi.DTOs.Admin;
using Microsoft.AspNetCore.Http;

namespace BookStoreApi.Services.Upload;

public class UploadService : IUploadService
{
    private readonly IWebHostEnvironment _env;
    private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
    private const long MaxFileSize = 5 * 1024 * 1024; // 5 MB
    private const int MaxFilesPerRequest = 10;

    public UploadService(IWebHostEnvironment env) => _env = env;

    public ServiceResult<UploadResultDTO> SaveImage(IFormFile file)
    {
        var result = SaveSingleFile(file);
        return result.Error is null
            ? ServiceResult<UploadResultDTO>.Ok(result.Data!)
            : ServiceResult<UploadResultDTO>.Fail(result.Error);
    }

    public UploadMultipleResultDTO SaveImages(List<IFormFile> files)
    {
        var response = new UploadMultipleResultDTO();

        if (files is null || files.Count == 0)
        {
            response.Errors.Add("Vui lòng chọn ít nhất một ảnh.");
            return response;
        }

        if (files.Count > MaxFilesPerRequest)
        {
            response.Errors.Add($"Chỉ được upload tối đa {MaxFilesPerRequest} ảnh mỗi lần.");
            return response;
        }

        foreach (var file in files)
        {
            var result = SaveSingleFile(file);
            if (result.Error is not null)
                response.Errors.Add($"{file.FileName}: {result.Error}");
            else
                response.Uploaded.Add(result.Data!);
        }

        return response;
    }

    // Hàm dùng chung cho cả single và multiple, tránh lặp code
    private (UploadResultDTO? Data, string? Error) SaveSingleFile(IFormFile file)
    {
        if (file is null || file.Length == 0)
            return (null, "File rỗng hoặc không hợp lệ.");

        if (file.Length > MaxFileSize)
            return (null, "Ảnh không được vượt quá 5MB.");

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext))
            return (null, "Chỉ chấp nhận file ảnh (jpg, png, webp, gif).");

        var fileName = $"{Guid.NewGuid()}{ext}";
        var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");

        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var filePath = Path.Combine(uploadsFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            // và đổi method signature thành async
            await file.CopyToAsync(stream);
        }

        return (new UploadResultDTO { Url = $"/uploads/{fileName}", FileName = fileName }, null);
    }

    // Thêm vào cuối class UploadService
    public void DeleteFiles(IEnumerable<string> relativeUrls)
    {
        var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");

        foreach (var url in relativeUrls)
        {
            // Chỉ xóa những file nội bộ bắt đầu bằng "/uploads/", bỏ qua link ảnh ngoài (https://...)
            if (string.IsNullOrWhiteSpace(url) || !url.StartsWith("/uploads/", StringComparison.OrdinalIgnoreCase))
                continue;

            // Lấy tên file an toàn (chống lỗi Path Traversal như "../../")
            var fileName = Path.GetFileName(url);
            var filePath = Path.Combine(uploadsFolder, fileName);

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
    }
}