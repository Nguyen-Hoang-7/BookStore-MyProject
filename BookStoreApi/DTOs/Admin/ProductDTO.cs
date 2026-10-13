// DTOs/Admin/ProductDTO.cs
using System.ComponentModel.DataAnnotations;

namespace BookStoreApi.DTOs.Admin;

public class CreateProductDTO
{
    [Required, StringLength(250, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Range(0, 100_000_000)]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue)]
    public int Stock { get; set; }

    public List<string> ImageUrls { get; set; } = new();

    [Required]
    public int CategoryId { get; set; }

    public CreateBookDetailDTO? BookDetail { get; set; }
}

public class UpdateProductDTO : CreateProductDTO
{
    public bool IsActive { get; set; } = true;
}

public class CreateBookDetailDTO
{
    [StringLength(50)]
    public string? Isbn { get; set; }

    [Range(1, 100_000)]
    public int? Pages { get; set; }

    public string? Language { get; set; }

    public DateTime? PublishedDate { get; set; }

    public int? PublisherId { get; set; }

    public List<int> AuthorIds { get; set; } = new();
}