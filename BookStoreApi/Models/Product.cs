namespace BookStoreApi.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; } // Sẽ cấu hình nvarchar(max)
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public bool IsActive { get; set; } = true;

    // Danh sách nhiều ảnh
    public List<string> ImageUrls { get; set; } = new();

    public int CategoryId { get; set; }
    public Category? Category { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Quan hệ 1 - 1 với BookDetail (chỉ có khi Category.Type == CategoryType.Book)
    public BookDetail? BookDetail { get; set; }
}