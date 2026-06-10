using Agazah.Domain.Enums;

namespace Agazah.Application.DTOs.Vacation;

public class VacationResponseDto
{
    public long Id { get; set; }

    public long EmployeeId { get; set; }

    public string EmployeeName { get; set; } = default!;

    public VacationType VacationType { get; set; }

    public DateTime StartDate { get; set; }

    public int Duration { get; set; }
}