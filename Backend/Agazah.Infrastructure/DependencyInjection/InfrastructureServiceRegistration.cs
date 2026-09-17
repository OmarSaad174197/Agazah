using Agazah.Application.Interfaces.Reports;
using Agazah.Application.Interfaces.Repositories;
using Agazah.Infrastructure.Persistence;
using Agazah.Infrastructure.Reporting;
using Agazah.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Agazah.Infrastructure.DependencyInjection;

public static class InfrastructureServiceRegistration
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"));
        });

        services.AddScoped<IEmployeeRepository, EmployeeRepository>();

        services.AddScoped<IVacationRepository, VacationRepository>();

        services.AddScoped<IUnitOfWork,Agazah.Infrastructure.UnitOfWork.UnitOfWork>();

        // Add the part which is related to reporting:

        services.Configure<SsrsOptions>(
            configuration.GetSection("SSRS"));

        services.AddHttpClient<ISsrsReportClient, SsrsReportClient>()
            .ConfigurePrimaryHttpMessageHandler(() =>
                new HttpClientHandler
                {
                    UseDefaultCredentials = true
                });

        return services;
    }
}