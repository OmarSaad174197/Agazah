using Agazah.Application.DTOs.Reports;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agazah.Application.Interfaces.Reports
{
    public interface ISsrsReportClient
    {
        Task<ReportFileDto> RenderAsync(
            string reportPath,
            string format,
            CancellationToken cancellationToken = default);
    }
}
