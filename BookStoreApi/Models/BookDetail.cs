namespace BookStoreApi.Models;

public class BookDetail
{
    // ProductId vừa là Primary Key vừa là Foreign Key
    public int ProductId { get; set; }
    public Product? Product { get; set; }

    public string? Isbn { get; set; }
    public int? Pages { get; set; }
    public string? Language { get; set; } = "Tiếng Việt";
    public DateTime? PublishedDate { get; set; }

    // Liên kết với Nhà xuất bản
    public int? PublisherId { get; set; }
    public Publisher? Publisher { get; set; }

    // Quan hệ N - N với Author (1 cuốn sách có thể có 1 hoặc nhiều tác giả)
    public ICollection<Author> Authors { get; set; } = new List<Author>();
}