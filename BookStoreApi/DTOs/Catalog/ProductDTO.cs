// DTOs/Catalog/ProductDto.cs
namespace BookStoreApi.DTOs.Catalog;

public class ProductDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public List<string> ImageUrls { get; set; } = new();

    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;

    // null nếu không phải sách
    public BookDetailDTO? BookDetail { get; set; }
}