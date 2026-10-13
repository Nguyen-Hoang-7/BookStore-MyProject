// Services/Catalog/IAuthorService.cs
using BookStoreApi.DTOs.Admin;
using BookStoreApi.DTOs.Catalog;

namespace BookStoreApi.Services.Catalog;

public interface IAuthorService
{
    Task<ServiceResult<List<AuthorDTO>>> GetAllAsync(string? q = null);
    Task<ServiceResult<AuthorDTO>> GetByIdAsync(int id);
    Task<ServiceResult<AuthorDTO>> CreateAsync(CreateAuthorDTO dto);
    Task<ServiceResult<AuthorDTO>> UpdateAsync(int id, UpdateAuthorDTO dto);
    Task<ServiceResult<bool>> DeleteAsync(int id);
}