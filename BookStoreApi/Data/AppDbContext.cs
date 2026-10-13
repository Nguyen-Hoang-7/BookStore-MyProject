using Microsoft.EntityFrameworkCore;
using BookStoreApi.Models;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace BookStoreApi.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<BookDetail> BookDetails => Set<BookDetail>();
    public DbSet<Publisher> Publishers => Set<Publisher>();
    public DbSet<Author> Authors => Set<Author>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        var imageUrlsComparer = new ValueComparer<List<string>>(
            (a, b) => (a ?? new()).SequenceEqual(b ?? new()),
            v => v.Aggregate(0, (hash, s) => HashCode.Combine(hash, s.GetHashCode())),
            v => v.ToList()
        );

        b.Entity<User>(e =>
        {
            e.Property(x => x.Email).HasMaxLength(256);
            e.HasIndex(x => x.Email).IsUnique();       // không cho trùng email

            e.Property(x => x.FullName).HasMaxLength(150);
            e.Property(x => x.PasswordHash).HasMaxLength(255);
            e.Property(x => x.PhoneNumber).HasMaxLength(20);
            e.Property(x => x.Address).HasMaxLength(300);
            e.Property(x => x.Role).HasMaxLength(20);
        });

        // ==========================================
        // 2. BẢNG CATEGORIES (Danh mục)
        // ==========================================
        b.Entity<Category>(e =>
        {
            e.ToTable("Categories");
            e.HasKey(x => x.Id);

            e.Property(x => x.Name).HasMaxLength(150).IsRequired();
            e.Property(x => x.Slug).HasMaxLength(160).IsRequired();
            e.HasIndex(x => x.Slug).IsUnique(); // Slug không trùng phục vụ SEO

            e.Property(x => x.Description).HasMaxLength(500);

            // Lưu Enum CategoryType ("Book", "Other") dưới dạng chuỗi
            e.Property(x => x.Type)
             .HasConversion<string>()
             .HasMaxLength(20)
             .IsRequired();
        });

        // ==========================================
        // 3. BẢNG PRODUCTS (Sản phẩm chung)
        // ==========================================
        b.Entity<Product>(e =>
        {
            e.ToTable("Products");
            e.HasKey(x => x.Id);

            e.Property(x => x.Name).HasMaxLength(250).IsRequired();
            e.Property(x => x.Slug).HasMaxLength(260).IsRequired();
            e.HasIndex(x => x.Slug).IsUnique();

            e.Property(x => x.Price).HasColumnType("decimal(18,2)").IsRequired();
            
            // Cho phép văn bản mô tả dài vô hạn (nvarchar(max))
            e.Property(x => x.Description).HasColumnType("nvarchar(max)");

            // Chuyển List<string> (nhiều ảnh) sang dạng chuỗi JSON lưu trong SQL Server
            e.Property(x => x.ImageUrls)
             .HasConversion(
                 v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                 v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
             )
             .Metadata.SetValueComparer(imageUrlsComparer);

            // Quan hệ 1-Nhiều với Category (1 Category có nhiều Product)
            e.HasOne(x => x.Category)
             .WithMany(c => c.Products)
             .HasForeignKey(x => x.CategoryId)
             .OnDelete(DeleteBehavior.Restrict); // Tránh xóa nhầm danh mục làm xóa sạch sản phẩm
        });

        // ==========================================
        // 4. BẢNG PUBLISHERS (Nhà xuất bản)
        // ==========================================
        b.Entity<Publisher>(e =>
        {
            e.ToTable("Publishers");
            e.HasKey(x => x.Id);

            e.Property(x => x.Name).HasMaxLength(200).IsRequired();
            e.Property(x => x.Address).HasMaxLength(300);
            e.Property(x => x.PhoneNumber).HasMaxLength(20);
        });

        // ==========================================
        // 5. BẢNG AUTHORS (Tác giả)
        // ==========================================
        b.Entity<Author>(e =>
        {
            e.ToTable("Authors");
            e.HasKey(x => x.Id);

            e.Property(x => x.Name).HasMaxLength(150).IsRequired();
            e.Property(x => x.Biography).HasColumnType("nvarchar(max)");
            e.Property(x => x.AvatarUrl).HasMaxLength(500);
        });

        // ==========================================
        // 6. BẢNG BOOKDETAILS (Chi tiết sách)
        // ==========================================
        b.Entity<BookDetail>(e =>
        {
            e.ToTable("BookDetails");

            // ProductId vừa là Primary Key vừa là Foreign Key
            e.HasKey(x => x.ProductId);

            e.Property(x => x.Isbn).HasMaxLength(50);
            e.Property(x => x.Language).HasMaxLength(50);

            // Quan hệ 1 - 1 với Product
            e.HasOne(x => x.Product)
             .WithOne(p => p.BookDetail)
             .HasForeignKey<BookDetail>(x => x.ProductId)
             .OnDelete(DeleteBehavior.Cascade); // Xóa Product thì xóa luôn BookDetail

            // Quan hệ N - 1 với Publisher (Nhiều sách thuộc 1 NXB)
            e.HasOne(x => x.Publisher)
             .WithMany(p => p.BookDetails)
             .HasForeignKey(x => x.PublisherId)
             .OnDelete(DeleteBehavior.SetNull); // Xóa NXB thì để null chứ không xóa sách

            // Quan hệ Nhiều - Nhiều (N - N) giữa BookDetail và Author
            // Tự động tạo bảng trung gian "BookDetailAuthors"
            e.HasMany(bd => bd.Authors)
             .WithMany(a => a.BookDetails)
             .UsingEntity(j => j.ToTable("BookDetailAuthors"));
        });
    }
}