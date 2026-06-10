using Agazah.Application.Interfaces.Repositories;
using Agazah.Infrastructure.Persistence;
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
        
        return services;
    }
}