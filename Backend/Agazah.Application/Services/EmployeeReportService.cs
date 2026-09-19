using Agazah.Application.DTOs.Reports;
using Agazah.Application.Interfaces.Reports;
using Agazah.Application.Interfaces.Services;
using Agazah.Domain.Enums.ReportEngine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agazah.Application.Services
{
    public sealed class EmployeeReportService : IEmployeeReportService
    
    {
        private const string EmployeeVacationRdlPath =
            "/Agazah.Reporting/EmployeeVacation";

        private readonly IEmployeeService _employeeService;
        private readonly ISsrsReportClient _ssrsReportClient;
        private readonly IRdlcReportRenderer _rdlcReportRenderer;

        public EmployeeReportService(
            IEmployeeService employeeService,
            ISsrsReportClient ssrsReportClient,
            IRdlcReportRenderer rdlcReportRenderer)
        {
            _employeeService = employeeService;
            _ssrsReportClient = ssrsReportClient;
            _rdlcReportRenderer = rdlcReportRenderer;
        }

        public async Task<ReportFileDto> RenderAsync(
            long employeeId,
            ReportEngine engine,
            ReportFormat format,
            CancellationToken cancellationToken = default)
        {
            if (employeeId <= 0)
            {
                throw new ArgumentException(
                    "Employee id must be greater than zero.",
                    nameof(employeeId));
            }

            /*
             * We get the employee details first for:
             *
             * 1. Validating that the employee exists.
             * 2. Supplying the data required by RDLC.
             *
             * The RDL/SSRS report still gets its actual report
             * data from its own Shared Data Source.
             */
            var employee =
                await _employeeService.GetDetailsAsync(
                    employeeId,
                    cancellationToken);

            return engine switch
            {
                ReportEngine.Rdl =>
                    await RenderRdlAsync(
                        employeeId,
                        format,
                        cancellationToken),

                ReportEngine.Rdlc =>
                    await _rdlcReportRenderer
                        .RenderEmployeeVacationAsync(
                            employee,
                            format,
                            cancellationToken),

                _ =>
                    throw new ArgumentOutOfRangeException(
                        nameof(engine),
                        engine,
                        "Unsupported report engine.")
            };
        }

        private Task<ReportFileDto> RenderRdlAsync(
            long employeeId,
            ReportFormat format,
            CancellationToken cancellationToken)
        {
            var parameters =
                new Dictionary<string, string>
                {
                    ["EmployeeId"] =
                        employeeId.ToString()
                };

            return _ssrsReportClient.RenderAsync(
                EmployeeVacationRdlPath,
                parameters,
                format,
                cancellationToken);
        }
    }
}