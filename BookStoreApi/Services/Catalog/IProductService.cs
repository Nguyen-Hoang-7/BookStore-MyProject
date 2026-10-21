// Services/Catalog/IProductService.cs
using BookStoreApi.DTOs.Admin;
using BookStoreApi.DTOs.Catalog;

namespace BookStoreApi.Services.Catalog;

public interface IProductService
{
    Task<ServiceResult<object>> SearchAsync(string? q, int? categoryId, int page, int pageSize, bool includeInactive = false);
    Task<ServiceResult<ProductDTO>> GetByIdAsync(int id);
    Task<ServiceResult<ProductDTO>> CreateAsync(CreateProductDTO dto);
    Task<ServiceResult<ProductDTO>> UpdateAsync(int id, UpdateProductDTO dto);
    Task<ServiceResult<bool>> DeleteAsync(int id);
}