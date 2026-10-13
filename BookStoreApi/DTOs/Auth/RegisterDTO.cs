using System.ComponentModel.DataAnnotations;

namespace BookStoreApi.DTOs.Auth;

public class RegisterDTO
{
    [Required(ErrorMessage = "Họ tên không được để trống")]
    [StringLength(150, MinimumLength = 2, ErrorMessage = "Họ tên từ 2 đến 150 ký tự")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email không được để trống")]
    [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Mật khẩu không được để trống")]
    [MinLength(8, ErrorMessage = "Mật khẩu phải từ 8 ký tự")]
    public string Password { get; set; } = string.Empty;

    [Phone(ErrorMessage = "Số điện thoại không đúng định dạng")]
    public string? PhoneNumber { get; set; }
    // public string Address { get; set; } = string.Empty;
}