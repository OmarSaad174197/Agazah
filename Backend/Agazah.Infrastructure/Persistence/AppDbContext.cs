using Agazah.Domain.Entities;
using Microsoft.EntityFrameworkCore;
namespace Agazah.Infrastructure.Persistence;
public class AppDbContext : DbContext
{
    public AppDbContext (DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<Vacation> Vacations => Set<Vacation>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(AppDbContext).Assembly);
        
        base.OnModelCreating(modelBuilder);
    }
}