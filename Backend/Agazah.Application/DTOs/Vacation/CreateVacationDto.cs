using Agazah.Domain.Enums;

namespace Agazah.Application.DTOs.Vacations;
public class CreateVacationDto
{
    public long EmployeeId { get; set; }

    public VacationType VacationType { get; set; }

    public DateTime StartDate { get; set; }

    public int Duration { get; set; }
}