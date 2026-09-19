using Agazah.Application.Interfaces.Services;
using Agazah.Domain.Enums.ReportEngine;
using Microsoft.AspNetCore.Mvc;

namespace Agazah.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ReportsController
    : ControllerBase
{
    private readonly IEmployeeReportService
        _employeeReportService;

    public ReportsController(
        IEmployeeReportService employeeReportService)
    {
        _employeeReportService =
            employeeReportService;
    }

    [HttpGet("employees/{employeeId:long}")]
    public async Task<IActionResult> GetEmployeeReport(
        long employeeId,
        [FromQuery]
        ReportEngine engine = ReportEngine.Rdl,
        [FromQuery]
        ReportFormat format = ReportFormat.Pdf,
        CancellationToken cancellationToken = default)
    {
        var report =
            await _employeeReportService.RenderAsync(
                employeeId,
                engine,
                format,
                cancellationToken);

        return File(
            report.Content,
            report.ContentType,
            report.FileName);
    }
}