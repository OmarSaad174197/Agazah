using Agazah.Domain.Entities;

namespace Agazah.Application.Interfaces.Repositories;

public interface IEmployeeRepository
{
    Task<Employee?> GetByIdAsync(long id);

    Task<Employee?> GetWithVacationsAsync(long id);

    Task<bool> ExistsByNumberAsync(
        string employeeNumber);

    Task<bool> ExistsByNameAsync(
        string employeeName);

    Task AddAsync(Employee employee);

    void Update(Employee employee);

    Task<List<Employee>> GetPagedAsync(
        int pageNumber,
        int pageSize);

    Task<int> CountAsync();
}