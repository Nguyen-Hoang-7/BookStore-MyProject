// DTOs/Catalog/PublisherDto.cs
namespace BookStoreApi.DTOs.Catalog;

public class PublisherDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
}