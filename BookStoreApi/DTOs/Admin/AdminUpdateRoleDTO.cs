// DTOs/Admin/AdminUpdateRoleDto.cs
using System.ComponentModel.DataAnnotations;

namespace BookStoreApi.DTOs.Admin;

public class AdminUpdateRoleDTO
{
    [Required]
    public string Role { get; set; } = string.Empty;   // "Admin" hoặc "Customer"
}