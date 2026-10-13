// DTOs/Admin/AdminMappingExtensions.cs
namespace BookStoreApi.DTOs.Admin;

public static class AdminMappingExtensions
{
    public static UserListItemDTO ToListItemDTO(this Models.User u) => new()
    {
        Id = u.Id,
        FullName = u.FullName,
        Email = u.Email,
        PhoneNumber = u.PhoneNumber,
        Role = u.Role,
        IsActive = u.IsActive,
        CreatedAt = u.CreatedAt
    };
}