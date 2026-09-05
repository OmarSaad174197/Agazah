using Agazah.Application.Interfaces.Services;
using Agazah.Application.Services;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace Agazah.Application.DependencyInjection;

public static class ApplicationServiceRegistration
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services)
    {
        services.AddAutoMapper(
            Assembly.GetExecutingAssembly());

        services.AddValidatorsFromAssembly(
            Assembly.GetExecutingAssembly());

        services.AddScoped<IEmployeeService, EmployeeService>();

        services.AddScoped<IVacationService, VacationService>();

        return services;
    }
}