// DTOs/Catalog/BookDetailDto.cs
namespace BookStoreApi.DTOs.Catalog;

public class BookDetailDTO
{
    public string? Isbn { get; set; }
    public int? Pages { get; set; }
    public string? Language { get; set; }
    public DateTime? PublishedDate { get; set; }
    public PublisherDTO? Publisher { get; set; }
    public List<AuthorDTO> Authors { get; set; } = new();
}