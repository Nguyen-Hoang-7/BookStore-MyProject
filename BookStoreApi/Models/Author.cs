namespace BookStoreApi.Models;

public class Author
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Biography { get; set; } // Tiểu sử tác giả
    public string? AvatarUrl { get; set; }

    // Navigation property: Danh sách sách của tác giả này
    public ICollection<BookDetail> BookDetails { get; set; } = new List<BookDetail>();
}