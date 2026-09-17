using Agazah.Application.DTOs.Reports;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agazah.Application.Interfaces.Services
{
    public interface IReportService
    {
        Task<ReportFileDto> GetEmployeeReportAsync(
            string format,
            CancellationToken cancellationToken = default);
    }
}
