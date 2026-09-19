namespace Agazah.Infrastructure.Reporting.Rdlc;

public sealed class EmployeeReportVacationRow
{
    public long Id { get; set; }

    public string VacationType { get; set; }
        = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public int Duration { get; set; }
}