using Agazah.Application.DTOs.Reports;
using Agazah.Application.Interfaces.Reports;
using Agazah.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agazah.Application.Services
{
    public sealed class ReportService : IReportService
    {
        private readonly ISsrsReportClient _ssrsReportClient;

        public ReportService(
            ISsrsReportClient ssrsReportClient)
        {
            _ssrsReportClient = ssrsReportClient;
        }

        public Task<ReportFileDto> GetEmployeeReportAsync(
            string format,
            CancellationToken cancellationToken = default)
        {
            return _ssrsReportClient.RenderAsync(
                "/Agazah.Reporting/Employee",
                format,
                cancellationToken);
        }
    }
}
