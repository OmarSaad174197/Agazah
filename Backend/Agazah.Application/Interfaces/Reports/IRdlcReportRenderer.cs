using System;
using Agazah.Application.DTOs.Employee;
using Agazah.Application.DTOs.Reports;
using Agazah.Domain.Enums.ReportEngine;

namespace Agazah.Application.Interfaces.Reports;

public interface IRdlcReportRenderer
{
    Task<ReportFileDto> RenderEmployeeVacationAsync(
        EmployeeDetailsDto employee,
        ReportFormat format,
        CancellationToken cancellationToken = default);
}
