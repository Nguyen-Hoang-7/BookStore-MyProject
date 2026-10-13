// DTOs/Admin/CategoryDTO.cs
using System.ComponentModel.DataAnnotations;
using BookStoreApi.Models;

namespace BookStoreApi.DTOs.Admin;

public class CreateCategoryDTO
{
    [Required(ErrorMessage = "Tên thể loại không được để trống")]
    [StringLength(150, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [Required]
    public CategoryType Type { get; set; } = CategoryType.Book;
}

public class UpdateCategoryDTO : CreateCategoryDTO
{
    public bool IsActive { get; set; } = true;
}