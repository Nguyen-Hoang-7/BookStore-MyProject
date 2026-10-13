namespace BookStoreApi.Models;

public class Publisher
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }

    public ICollection<BookDetail> BookDetails { get; set; } = new List<BookDetail>();
}