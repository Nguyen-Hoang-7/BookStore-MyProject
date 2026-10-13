// Services/Catalog/IPublisherService.cs
using BookStoreApi.DTOs.Admin;
using BookStoreApi.DTOs.Catalog;

namespace BookStoreApi.Services.Catalog;

public interface IPublisherService
{
    Task<ServiceResult<List<PublisherDTO>>> GetAllAsync();
    Task<ServiceResult<PublisherDTO>> GetByIdAsync(int id);
    Task<ServiceResult<PublisherDTO>> CreateAsync(CreatePublisherDTO dto);
    Task<ServiceResult<PublisherDTO>> UpdateAsync(int id, UpdatePublisherDTO dto);
    Task<ServiceResult<bool>> DeleteAsync(int id);
}