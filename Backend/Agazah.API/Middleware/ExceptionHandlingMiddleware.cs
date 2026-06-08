using System.Net;
using System.Text.Json;
using Agazah.Application.Exceptions;

namespace Agazah.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionHandlingMiddleware(
        RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(
        HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(
                context,
                ex);
        }
    }

    private static async Task HandleExceptionAsync(
        HttpContext context,
        Exception exception)
    {
        context.Response.ContentType =
            "application/json";

        var statusCode =
            exception switch
            {
                NotFoundException =>
                    (int)HttpStatusCode.NotFound,

                BusinessRuleException =>
                    (int)HttpStatusCode.BadRequest,

                _ =>
                    (int)HttpStatusCode.InternalServerError
            };

        context.Response.StatusCode =
            statusCode;

        var response = new
        {
            Message = exception.Message
        };

        await context.Response.WriteAsync(
            JsonSerializer.Serialize(response));
    }
}