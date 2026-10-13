// DTOs/Catalog/AuthorDto.cs
namespace BookStoreApi.DTOs.Catalog;

public class AuthorDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Biography { get; set; }
    public string? AvatarUrl { get; set; }
}