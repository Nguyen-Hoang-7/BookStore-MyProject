using BookStoreApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BookStoreApi.Data;

public static class DbSeeder
{
    public static async Task SeedAdminAsync(IServiceProvider services)
    {
        var db = services.GetRequiredService<AppDbContext>();
        var config = services.GetRequiredService<IConfiguration>();

        await db.Database.MigrateAsync();

        var email = config["SeedAdmin:Email"];
        var password = config["SeedAdmin:Password"];
        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            return;

        email = email.Trim().ToLowerInvariant();
        if (await db.Users.AnyAsync(u => u.Email == email))
            return;   // đã có Admin này rồi thì không tạo lại

        db.Users.Add(new User
        {
            FullName = "Quản trị viên",
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            Role = "Admin",
            IsActive = true
        });

        await db.SaveChangesAsync();
    }
}