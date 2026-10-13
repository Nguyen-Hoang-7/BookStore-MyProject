// DTOs/User/UserMappingExtensions.cs
namespace BookStoreApi.DTOs.User;

public static class UserMappingExtensions
{
    public static UserDTO ToDTO(this Models.User u) => new()
    {
        Id = u.Id,
        FullName = u.FullName,
        Email = u.Email,
        PhoneNumber = u.PhoneNumber,
        Address = u.Address,
        Role = u.Role,
        AvatarUrl = u.AvatarUrl,
        CreatedAt = u.CreatedAt
    };
}