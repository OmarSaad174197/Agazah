using Agazah.Domain.Enums;

namespace Agazah.Infrastructure.Reporting.Rdlc;

public sealed class EmployeeReportHeaderRow
{
    public long Id { get; set; }

    public string EmployeeNumber { get; set; }
        = string.Empty;

    public string EmployeeName { get; set; }
        = string.Empty;

    public DateTime BirthDate { get; set; }

    public string Qualification { get; set; }
        = string.Empty;

    public int TotalVacationDays { get; set; }
}