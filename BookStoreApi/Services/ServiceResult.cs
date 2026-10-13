// Services/ServiceResult.cs
namespace BookStoreApi.Services;

public class ServiceResult<T>
{
    public bool Success { get; private set; }
    public string? ErrorMessage { get; private set; }
    public ServiceErrorType ErrorType { get; private set; }
    public T? Data { get; private set; }

    public static ServiceResult<T> Ok(T data) => new() { Success = true, Data = data };

    public static ServiceResult<T> Fail(string message, ServiceErrorType type = ServiceErrorType.BadRequest) =>
        new() { Success = false, ErrorMessage = message, ErrorType = type };
}

public enum ServiceErrorType { BadRequest, NotFound, Conflict, Forbidden, Unauthorized }