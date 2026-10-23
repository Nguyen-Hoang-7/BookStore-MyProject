// Services/Auth/AuthService.cs
using BookStoreApi.Data;
using BookStoreApi.DTOs.Auth;
using BookStoreApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace BookStoreApi.Services.Auth;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly ITokenService _tokenService;

    public AuthService(AppDbContext db, ITokenService tokenService)
    {
        _db = db;
        _tokenService = tokenService;
    }

    public async Task<ServiceResult<AuthResponseDTO>> RegisterAsync(RegisterDTO dto)
    {
        var email = dto.Email.Trim().ToLowerInvariant();

        if (await _db.Users.AnyAsync(u => u.Email == email))
            return ServiceResult<AuthResponseDTO>.Fail("Email đã được sử dụng.", ServiceErrorType.Conflict);

        var user = new User
        {
            FullName = dto.FullName.Trim(),
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            PhoneNumber = dto.PhoneNumber ?? string.Empty,
            Role = "Customer"
        };

        _db.Users.Add(user);

        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
            when (ex.GetBaseException() is SqlException sqlEx
                && (sqlEx.Number == 2601 || sqlEx.Number == 2627))
        {
            // 2601: Trùng unique index
            // 2627: Vi phạm UNIQUE constraint hoặc PRIMARY KEY
            return ServiceResult<AuthResponseDTO>.Fail(
                "Email đã được sử dụng.",
                ServiceErrorType.Conflict
            );
        }

        return ServiceResult<AuthResponseDTO>.Ok(_tokenService.CreateToken(user));
    }

    public async Task<ServiceResult<AuthResponseDTO>> LoginAsync(LoginDTO dto)
    {
        var email = dto.Email.Trim().ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return ServiceResult<AuthResponseDTO>.Fail("Email hoặc mật khẩu không đúng.", ServiceErrorType.Unauthorized);

        if (!user.IsActive)
            return ServiceResult<AuthResponseDTO>.Fail("Tài khoản đã bị khóa.", ServiceErrorType.Forbidden);

        return ServiceResult<AuthResponseDTO>.Ok(_tokenService.CreateToken(user));
    }
}