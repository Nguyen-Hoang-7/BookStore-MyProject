// DTOs/User/ChangePasswordDto.cs
using System.ComponentModel.DataAnnotations;

namespace BookStoreApi.DTOs.User;

public class ChangePasswordDTO
{
    [Required(ErrorMessage = "Vui lòng nhập mật khẩu hiện tại")]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required, MinLength(8, ErrorMessage = "Mật khẩu mới phải từ 8 ký tự")]
    public string NewPassword { get; set; } = string.Empty;
}