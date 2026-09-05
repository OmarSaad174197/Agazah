using Agazah.Application.DTOs.Employee;
using Agazah.Domain.Entities;
using AutoMapper;

namespace Agazah.Application.Mappings;

public class EmployeeProfile : Profile
{
    public EmployeeProfile()
    {
        CreateMap<CreateEmployeeDto, Employee>();

        CreateMap<Employee, EmployeeResponseDto>();

        CreateMap<Employee, EmployeeDetailsDto>();
    }
}