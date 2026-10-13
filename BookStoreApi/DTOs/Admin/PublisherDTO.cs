// DTOs/Admin/PublisherDTO.cs
using System.ComponentModel.DataAnnotations;

namespace BookStoreApi.DTOs.Admin;

public class CreatePublisherDTO
{
    [Required(ErrorMessage = "Tên nhà xuất bản không được để trống")]
    [StringLength(200, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [StringLength(300)]
    public string? Address { get; set; }

    [Phone]
    public string? PhoneNumber { get; set; }
}

public class UpdatePublisherDTO : CreatePublisherDTO
{
}