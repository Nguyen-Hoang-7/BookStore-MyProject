// DTOs/Catalog/CatalogMappingExtensions.cs
using BookStoreApi.Models;

namespace BookStoreApi.DTOs.Catalog;

public static class CatalogMappingExtensions
{
    public static AuthorDTO ToDto(this Author a) => new()
    {
        Id = a.Id,
        Name = a.Name,
        Biography = a.Biography,
        AvatarUrl = a.AvatarUrl
    };

    public static PublisherDTO ToDto(this Publisher p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Address = p.Address,
        PhoneNumber = p.PhoneNumber
    };

    public static CategoryDTO ToDto(this Category c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        Slug = c.Slug,
        Description = c.Description,
        Type = c.Type,
        ProductCount = c.Products?.Count ?? 0
    };

    public static ProductDTO ToDto(this Product p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Slug = p.Slug,
        Description = p.Description,
        Price = p.Price,
        Stock = p.Stock,
        ImageUrls = p.ImageUrls,
        CategoryId = p.CategoryId,
        CategoryName = p.Category?.Name ?? string.Empty,
        BookDetail = p.BookDetail is null ? null : new BookDetailDTO
        {
            Isbn = p.BookDetail.Isbn,
            Pages = p.BookDetail.Pages,
            Language = p.BookDetail.Language,
            PublishedDate = p.BookDetail.PublishedDate,
            Publisher = p.BookDetail.Publisher?.ToDto(),
            Authors = p.BookDetail.Authors.Select(a => a.ToDto()).ToList()
        }
    };

    // Dùng chung cho cả Category lẫn Product vì cùng có Slug
    public static string ToSlug(this string input)
    {
        var normalized = input.Trim().ToLowerInvariant()
            .Normalize(System.Text.NormalizationForm.FormD);

        var sb = new System.Text.StringBuilder();
        foreach (var ch in normalized)
        {
            var cat = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(ch);
            if (cat != System.Globalization.UnicodeCategory.NonSpacingMark)
                sb.Append(ch);
        }

        var slug = sb.ToString().Normalize(System.Text.NormalizationForm.FormC);
        slug = System.Text.RegularExpressions.Regex.Replace(slug, @"[^a-z0-9\s-]", "");
        slug = System.Text.RegularExpressions.Regex.Replace(slug, @"\s+", "-").Trim('-');
        return slug;
    }
}