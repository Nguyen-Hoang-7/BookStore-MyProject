namespace BookStoreApi.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;

    // Phân loại danh mục: Sách hay Khác
    public CategoryType Type { get; set; } = CategoryType.Book;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Quan hệ 1-Nhiều với Product
    public ICollection<Product> Products { get; set; } = new List<Product>();
}