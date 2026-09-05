using Agazah.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Agazah.Infrastructure.Configurations;

public class VacationConfiguration : IEntityTypeConfiguration<Vacation>
    
{
    public void Configure(EntityTypeBuilder<Vacation> builder)
    {
        builder.ToTable("Vacations");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Duration)
            .IsRequired();

        builder.Property(x => x.StartDate)
            .IsRequired();

        builder.Property(x => x.VacationType)
            .IsRequired();
    }
}