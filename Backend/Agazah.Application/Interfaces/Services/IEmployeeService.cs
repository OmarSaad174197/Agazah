using Agazah.Application.Common;
using Agazah.Application.DTOs.Employee;

namespace Agazah.Application.Interfaces.Services;

public interface IEmployeeService
{
    Task<long> CreateAsync(
        CreateEmployeeDto dto,
        CancellationToken cancellationToken = default);

    Task UpdateAsync(
        long id,
        UpdateEmployeeDto dto,
        CancellationToken cancellationToken = default);

    Task DeleteAsync(
        long id,
        CancellationToken cancellationToken = default);

    Task<EmployeeDetailsDto?> GetDetailsAsync(
        long id,
        CancellationToken cancellationToken = default);

    Task<PagedResult<EmployeeResponseDto>> GetPagedAsync(
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken = default);
}