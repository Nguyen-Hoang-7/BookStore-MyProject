namespace BookStoreApi.Models;
public static class Roles
{
    public const string Admin = "Admin";
    public const string Customer = "Customer";
}

public class User
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Role { get; set; } = Roles.Customer;

    public bool IsActive { get; set; } = true;      // false = tài khoản bị khóa

    public string? AvatarUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}