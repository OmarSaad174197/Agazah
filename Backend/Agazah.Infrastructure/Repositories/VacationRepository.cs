using Agazah.Application.Interfaces.Repositories;
using Agazah.Domain.Entities;
using Agazah.Domain.Enums;
using Agazah.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Agazah.Infrastructure.Repositories;

public class VacationRepository : IVacationRepository
{
    private readonly AppDbContext _context;

    public VacationRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Vacation vacation)
    {
        await _context.Vacations.AddAsync(vacation);
    }

    public async Task<Vacation?> GetByIdAsync(long id)
    {
        return await _context.Vacations
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<List<Vacation>> GetEmployeeVacationsAsync(
        long employeeId)
    {
        return await _context.Vacations
            .Where(x => x.EmployeeId == employeeId)
            .ToListAsync();
    }

    public void Update(Vacation vacation)
    {
        _context.Vacations.Update(vacation);
    }

    public async Task<int> GetVacationDaysForTypeInYearAsync(
        long employeeId,
        VacationType vacationType,
        int year)
    {
        return await _context.Vacations
            .Where(x =>
                x.EmployeeId == employeeId &&
                x.VacationType == vacationType &&
                x.StartDate.Year == year)
            .SumAsync(x => x.Duration);
    }
}