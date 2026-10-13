// DTOs/Admin/AuthorDTO.cs
using System.ComponentModel.DataAnnotations;

namespace BookStoreApi.DTOs.Admin;

public class CreateAuthorDTO
{
    [Required(ErrorMessage = "Tên tác giả không được để trống")]
    [StringLength(150, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    public string? Biography { get; set; }

    public string? AvatarUrl { get; set; }
}

public class UpdateAuthorDTO : CreateAuthorDTO
{
}