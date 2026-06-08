using Agazah.Domain.Entities;
using Agazah.Domain.Enums;

namespace Agazah.Application.Interfaces.Repositories;

public interface IVacationRepository
{
    Task<Vacation?> GetByIdAsync(long id);

    Task<List<Vacation>> GetEmployeeVacationsAsync(
        long employeeId);

    Task AddAsync(Vacation vacation);

    void Update(Vacation vacation);

    Task<int> GetVacationDaysForTypeInYearAsync(
        long employeeId,
        VacationType vacationType,
        int year);

    Task<List<Vacation>> GetEmployeeVacationsWithEmployeeAsync(
    long employeeId);
}