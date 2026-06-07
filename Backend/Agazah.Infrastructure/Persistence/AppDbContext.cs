using Agazah.Domain.Common;
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
        
        modelBuilder.Entity<Employee>()
            .HasQueryFilter(x => !x.IsDeleted);

        modelBuilder.Entity<Vacation>()
            .HasQueryFilter(x => !x.IsDeleted);

        base.OnModelCreating(modelBuilder);
    }

    //Method to automatically set Audit fields (CreatedOn, ModifiedOn) when saving changes to the database
    public override async Task<int> SaveChangesAsync(
    CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedOn = DateTime.UtcNow;
            }

            if (entry.State == EntityState.Modified)
            {
                entry.Entity.ModifiedOn = DateTime.UtcNow;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}