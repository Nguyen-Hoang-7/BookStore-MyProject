// DTOs/Users/UpdateProfileDto.cs
using System.ComponentModel.DataAnnotations;

namespace BookStoreApi.DTOs.User;

public class UpdateProfileDTO
{
    [Required, StringLength(150, MinimumLength = 2)]
    public string FullName { get; set; } = string.Empty;

    [Phone]
    public string? PhoneNumber { get; set; }

    [StringLength(300)]
    public string? Address { get; set; }

    public string? AvatarUrl { get; set; }
}