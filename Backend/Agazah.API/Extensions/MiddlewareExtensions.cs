using Agazah.API.Middleware;

namespace Agazah.API.Extensions;

public static class MiddlewareExtensions
{
    public static IApplicationBuilder
        UseGlobalExceptionHandling(
            this IApplicationBuilder app)
    {
        return app.UseMiddleware<
            ExceptionHandlingMiddleware>();
    }
}