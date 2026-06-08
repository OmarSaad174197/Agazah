using Agazah.Application.DTOs.Vacation;
using Agazah.Application.DTOs.Vacations;

namespace Agazah.Application.Interfaces.Services;

public interface IVacationService
{
    Task<long> CreateAsync(
        CreateVacationDto dto,
        CancellationToken cancellationToken = default);

    Task DeleteAsync(
        long vacationId,
        CancellationToken cancellationToken = default);

    Task<List<VacationResponseDto>>
        GetEmployeeVacationsAsync(
            long employeeId,
            CancellationToken cancellationToken = default);
}