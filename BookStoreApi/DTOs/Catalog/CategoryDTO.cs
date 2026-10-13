// DTOs/Catalog/CategoryDto.cs
using BookStoreApi.Models;

namespace BookStoreApi.DTOs.Catalog;

public class CategoryDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public CategoryType Type { get; set; }
    public int ProductCount { get; set; }
}