using Agazah.Application.Common;
using Agazah.Application.DTOs.Employee;
using Agazah.Application.Exceptions;
using Agazah.Application.Interfaces;
using Agazah.Application.Interfaces.Repositories;
using Agazah.Application.Interfaces.Services;
using Agazah.Domain.Entities;
using AutoMapper;
using FluentValidation;

namespace Agazah.Application.Services;

public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateEmployeeDto> _createValidator;
    private readonly IValidator<UpdateEmployeeDto> _updateValidator;

    public EmployeeService(
        IEmployeeRepository employeeRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IValidator<CreateEmployeeDto> createValidator,
        IValidator<UpdateEmployeeDto> updateValidator)
    {
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    public async Task<long> CreateAsync(
        CreateEmployeeDto dto,
        CancellationToken cancellationToken = default)
    {
        await _createValidator.ValidateAndThrowAsync(
            dto,
            cancellationToken);

        var employeeName = dto.EmployeeName.Trim();

        var employeeNumber = dto.EmployeeNumber.Trim();

        var numberExists =
            await _employeeRepository.ExistsByNumberAsync(
                employeeNumber);

        if (numberExists)
        {
            throw new BusinessRuleException(
                "Employee number already exists");
        }

        var nameExists =
            await _employeeRepository.ExistsByNameAsync(
                employeeName);

        if (nameExists)
        {
            throw new BusinessRuleException(
                "Employee name already exists");
        }

        var employee =
            _mapper.Map<Employee>(dto);
        employee.EmployeeName = employeeName;
        employee.EmployeeNumber = employeeNumber;

        await _employeeRepository.AddAsync(employee);

        await _unitOfWork.SaveChangesAsync(
            cancellationToken);

        return employee.Id;
    }
    public async Task<EmployeeDetailsDto> GetDetailsAsync(
        long id,
        CancellationToken cancellationToken = default)
    {
        var employee =
            await _employeeRepository.GetWithVacationsAsync(id);

        if (employee is null)
        {
            throw new NotFoundException(
                "Employee not found");
        }

        var result =
            _mapper.Map<EmployeeDetailsDto>(employee);

        result.TotalVacationDays =
            employee.Vacations.Sum(x => x.Duration);

        return result;
    }
    public async Task UpdateAsync(
        long id,
        UpdateEmployeeDto dto,
        CancellationToken cancellationToken = default)
    {
        await _updateValidator.ValidateAndThrowAsync(
            dto,
            cancellationToken);

        var employee =
            await _employeeRepository.GetByIdAsync(id);

        if (employee is null)
        {
            throw new NotFoundException(
                "Employee not found");
        }

        var employeeName =
            dto.EmployeeName.Trim();

        var nameExists =
            await _employeeRepository.ExistsByNameAsync(
                employeeName,
                id);

        if (nameExists)
        {
            throw new BusinessRuleException(
                "Employee name already exists");
        }

        employee.EmployeeName = employeeName;
        employee.BirthDate = dto.BirthDate;
        employee.Qualification = dto.Qualification;

        _employeeRepository.Update(employee);

        await _unitOfWork.SaveChangesAsync(
            cancellationToken);
    }

    public async Task DeleteAsync(
        long id,
        CancellationToken cancellationToken = default)
    {
        var employee =
            await _employeeRepository
                .GetWithVacationsAsync(id);

        if (employee is null)
        {
            throw new NotFoundException(
                "Employee not found");
        }

        employee.IsDeleted = true;

        foreach (var vacation in employee.Vacations)
        {
            vacation.IsDeleted = true;
        }

        _employeeRepository.Update(employee);

        await _unitOfWork.SaveChangesAsync(
            cancellationToken);
    }

    public async Task<PagedResult<EmployeeResponseDto>> GetPagedAsync
    (
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        var employees =
            await _employeeRepository
                .GetPagedWithVacationsAsync(
                    pageNumber,
                    pageSize);

        var totalCount =
            await _employeeRepository.CountAsync();

        var items =
            employees
                .Select(x => new EmployeeResponseDto
                {
                    Id = x.Id,
                    EmployeeNumber = x.EmployeeNumber,
                    EmployeeName = x.EmployeeName,
                    BirthDate = x.BirthDate,
                    Qualification = x.Qualification,
                    TotalVacationDays =
                        x.Vacations.Sum(v => v.Duration)
                })
                .ToList();

        return new PagedResult<EmployeeResponseDto>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }
}