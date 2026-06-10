using Agazah.Domain.Enums;

namespace Agazah.Application.DTOs.Employee;
public class UpdateEmployeeDto
{
    public string EmployeeName { get; set; } = default!;

    public DateTime BirthDate { get; set; }
    public Qualification Qualification { get; set; }
}