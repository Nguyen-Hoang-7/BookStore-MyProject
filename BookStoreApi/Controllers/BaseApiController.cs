using BookStoreApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreApi.Controllers;

public abstract class BaseApiController : ControllerBase
{
    protected IActionResult ToErrorResponse<T>(ServiceResult<T> result)
    {
        var body = new { message = result.ErrorMessage };
        return result.ErrorType switch
        {
            ServiceErrorType.Conflict => Conflict(body),
            ServiceErrorType.Unauthorized => Unauthorized(body),
            ServiceErrorType.Forbidden => StatusCode(403, body),
            ServiceErrorType.NotFound => NotFound(body),
            _ => BadRequest(body)
        };
    }
}