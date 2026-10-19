// DTOs/Admin/UploadDTO.cs
namespace BookStoreApi.DTOs.Admin;

public class UploadResultDTO
{
    public string Url { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
}

public class UploadMultipleResultDTO
{
    public List<UploadResultDTO> Uploaded { get; set; } = new();
    public List<string> Errors { get; set; } = new();  // lưu lỗi của từng file bị từ chối, không chặn cả batch
}