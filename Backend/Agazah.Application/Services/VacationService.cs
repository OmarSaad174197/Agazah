using Agazah.Application.DTOs.Vacation;
using Agazah.Application.DTOs.Vacations;
using Agazah.Application.Exceptions;
using Agazah.Application.Interfaces.Repositories;
using Agazah.Domain.Entities;
using AutoMapper;
namespace Agazah.Application.Interfaces.Services;

public class VacationService : IVacationService
{
    private readonly IVacationRepository _vacationRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public VacationService(
        IVacationRepository vacationRepository,
        IEmployeeRepository employeeRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _vacationRepository = vacationRepository;
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<long> CreateAsync(
        CreateVacationDto dto,
        CancellationToken cancellationToken = default)
    {
        var employee =
            await _employeeRepository
                .GetByIdAsync(dto.EmployeeId);

        if (employee is null)
        {
            throw new NotFoundException(
                "Employee not found");
        }

        var currentDays =
            await _vacationRepository
                .GetVacationDaysForTypeInYearAsync(
                    dto.EmployeeId,
                    dto.VacationType,
                    dto.StartDate.Year);

        if (currentDays + dto.Duration > 30)
        {
            throw new BusinessRuleException(
                "Vacation yearly limit exceeded");
        }

        var vacations =
            await _vacationRepository
                .GetEmployeeVacationsAsync(
                    dto.EmployeeId);

        var newStart = dto.StartDate.Date;

        var newEnd =
            dto.StartDate.Date
                .AddDays(dto.Duration - 1);

        var overlapExists =
            vacations.Any(v =>
            {
                var existingStart =
                    v.StartDate.Date;

                var existingEnd =
                    v.StartDate.Date
                        .AddDays(v.Duration - 1);

                return
                    newStart <= existingEnd
                    &&
                    newEnd >= existingStart;
            });

        if (overlapExists)
        {
            throw new BusinessRuleException(
                "Vacation overlaps with existing vacation");
        }

        var vacation =
            _mapper.Map<Vacation>(dto);

        await _vacationRepository
            .AddAsync(vacation);

        await _unitOfWork
            .SaveChangesAsync(
                cancellationToken);

        return vacation.Id;
    }
    public async Task DeleteAsync(
        long vacationId,
        CancellationToken cancellationToken = default)
    {
        var vacation =
            await _vacationRepository
                .GetByIdAsync(vacationId);

        if (vacation is null)
        {
            throw new NotFoundException(
                "Vacation not found");
        }

        vacation.IsDeleted = true;

        _vacationRepository.Update(vacation);

        await _unitOfWork
            .SaveChangesAsync(
                cancellationToken);
    }

    public async Task<List<VacationResponseDto>>
        GetEmployeeVacationsAsync(
            long employeeId,
            CancellationToken cancellationToken = default)
    {
        var vacations =
            await _vacationRepository
                .GetEmployeeVacationsWithEmployeeAsync(
                    employeeId);

        return _mapper.Map<List<VacationResponseDto>>(
            vacations);
    }  
}