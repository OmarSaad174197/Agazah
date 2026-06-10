using System.Net;
using System.Text.Json;
using Agazah.API.Models;
using Agazah.Application.Exceptions;
using FluentValidation;

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
        catch (Exception exception)
        {
            await HandleExceptionAsync(
                context,
                exception);
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
                ValidationException =>
                    (int)HttpStatusCode.BadRequest,

                BusinessRuleException =>
                    (int)HttpStatusCode.BadRequest,

                NotFoundException =>
                    (int)HttpStatusCode.NotFound,

                _ =>
                    (int)HttpStatusCode.InternalServerError
            };

        context.Response.StatusCode =
            statusCode;

        var response = new ErrorResponse
        {
            StatusCode = statusCode,
            TimeStamp = DateTime.UtcNow
        };

        switch (exception)
        {
            case ValidationException validationException:

                response.Message =
                    "Validation failed.";

                response.Errors =
                    validationException.Errors
                        .Select(x => x.ErrorMessage)
                        .Distinct()
                        .ToList();

                break;

            case BusinessRuleException:

                response.Message =
                    exception.Message;

                break;

            case NotFoundException:

                response.Message =
                    exception.Message;

                break;

            default:

                response.Message =
                    "An unexpected error occurred.";

                break;
        }

        var json =
            JsonSerializer.Serialize(
                response,
                new JsonSerializerOptions
                {
                    PropertyNamingPolicy =
                        JsonNamingPolicy.CamelCase
                });

        await context.Response.WriteAsync(
            json);
    }
}