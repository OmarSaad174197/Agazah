using Agazah.Application.Interfaces.Repositories;
using Agazah.Domain.Entities;
using Agazah.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Agazah.Infrastructure.Repositories;

public class EmployeeRepository : IEmployeeRepository
{
    private readonly AppDbContext _context;

    public EmployeeRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Employee employee)
    {
        await _context.Employees.AddAsync(employee);
    }

    public async Task<Employee?> GetByIdAsync(long id)
    {
        return await _context.Employees
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Employee?> GetWithVacationsAsync(long id)
    {
        return await _context.Employees
            .Include(x => x.Vacations)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<bool> ExistsByNumberAsync(
        string employeeNumber,
        long? excludeEmployeeId = null)
    {
        return await _context.Employees
            .AnyAsync(x =>
                x.EmployeeNumber == employeeNumber &&
                (!excludeEmployeeId.HasValue ||
                x.Id != excludeEmployeeId.Value));
    }

    public async Task<bool> ExistsByNameAsync(
        string employeeName,
        long? excludeEmployeeId = null)
    {
        return await _context.Employees
            .AnyAsync(x =>
                x.EmployeeName == employeeName &&
                (!excludeEmployeeId.HasValue ||
                x.Id != excludeEmployeeId.Value));
    }

    public void Update(Employee employee)
    {
        _context.Employees.Update(employee);
    }

    public async Task<List<Employee>> GetPagedAsync(
        int pageNumber,
        int pageSize)
    {
        return await _context.Employees
            .OrderBy(x => x.Id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> CountAsync()
    {
        return await _context.Employees.CountAsync();
    }
}