using Agazah.Application.DTOs.Reports;
using Agazah.Domain.Enums.ReportEngine;
namespace Agazah.Application.Interfaces.Services
{
    public interface IEmployeeReportService
    {
        Task<ReportFileDto> RenderAsync(
            long employeeId,
            ReportEngine engine,
            ReportFormat format,
            CancellationToken cancellationToken = default);
    }
}
