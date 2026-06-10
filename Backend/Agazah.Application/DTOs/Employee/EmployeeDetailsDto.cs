using Agazah.Application.DTOs.Vacation;
using Agazah.Domain.Enums;
namespace Agazah.Application.DTOs.Employee;

public class EmployeeDetailsDto
{
    public long Id { get; set; }

    public string EmployeeNumber { get; set; } = default!;

    public string EmployeeName { get; set; } = default!;

    public DateTime BirthDate { get; set; }

    public Qualification Qualification { get; set; }

    public int TotalVacationDays { get; set; }

    public List<VacationResponseDto> Vacations { get; set; }
        = [];
}