// Services/Catalog/ICategoryService.cs
using BookStoreApi.DTOs.Admin;
using BookStoreApi.DTOs.Catalog;
using BookStoreApi.Models;

namespace BookStoreApi.Services.Catalog;

public interface ICategoryService
{
    Task<ServiceResult<List<CategoryDTO>>> GetAllAsync(CategoryType? type = null);
    Task<ServiceResult<CategoryDTO>> GetByIdAsync(int id);
    Task<ServiceResult<CategoryDTO>> CreateAsync(CreateCategoryDTO dto);
    Task<ServiceResult<CategoryDTO>> UpdateAsync(int id, UpdateCategoryDTO dto);
    Task<ServiceResult<bool>> DeleteAsync(int id);
}