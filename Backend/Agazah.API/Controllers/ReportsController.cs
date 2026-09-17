using Agazah.Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Agazah.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportsController(
            IReportService reportService
            )
        {
            _reportService = reportService;
        }

        [HttpGet("employees")]

        public async Task<IActionResult> GetEmployeeReport(
              [FromQuery] string format = "PDF",
              CancellationToken cancellationToken = default
            )
        {
            var report =
                await _reportService.GetEmployeeReportAsync(
                    format,
                    cancellationToken);
            return File(
                report.Content,
                report.ContentType,
                report.FileName
                );
        }
    }
}
