using Agazah.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Agazah.Infrastructure.Configurations;
public class EmployeeConfiguration : IEntityTypeConfiguration<Employee>
{
    public void Configure (EntityTypeBuilder<Employee> builder)
    {
       builder.ToTable("Employees");

       builder.HasKey(x => x.Id); 

       builder.Property(x => x.EmployeeNumber)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(x=> x.EmployeeName)
            .HasMaxLength(200)
            .IsRequired();
        
        builder.Property(x => x.BirthDate)
            .IsRequired();

        builder.Property(x => x.Qualification)
            .IsRequired();

        builder.HasMany(x => x.Vacations)
            .WithOne(x => x.Employee)
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}