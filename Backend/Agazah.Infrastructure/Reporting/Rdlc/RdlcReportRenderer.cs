using Agazah.Application.DTOs.Employee;
using Agazah.Application.DTOs.Reports;
using Agazah.Application.Interfaces.Reports;
using Agazah.Domain.Enums.ReportEngine;
using Microsoft.Reporting.NETCore;

namespace Agazah.Infrastructure.Reporting.Rdlc;

public sealed class RdlcReportRenderer
    : IRdlcReportRenderer
{
    private const string HeaderDataSetName =
        "EmployeeHeaderDataSet";

    private const string VacationDataSetName =
        "EmployeeVacationDataSet";

    public Task<ReportFileDto>
        RenderEmployeeVacationAsync(
            EmployeeDetailsDto employee,
            ReportFormat format,
            CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var reportPath =
            Path.Combine(
                AppContext.BaseDirectory,
                "Reporting",
                "RDLC",
                "EmployeeVacation.rdlc");

        if (!File.Exists(reportPath))
        {
            throw new FileNotFoundException(
                "RDLC report definition was not found.",
                reportPath);
        }

        using var reportStream =
            File.OpenRead(reportPath);

        using var report =
            new LocalReport();

        report.LoadReportDefinition(
            reportStream);

        var headerRows =
            new[]
            {
                new EmployeeReportHeaderRow
                {
                    Id =
                        employee.Id,

                    EmployeeNumber =
                        employee.EmployeeNumber,

                    EmployeeName =
                        employee.EmployeeName,

                    BirthDate =
                        employee.BirthDate,

                    Qualification =
                        GetQualificationArabic(
                            (int)employee.Qualification),

                    TotalVacationDays =
                        employee.TotalVacationDays
                }
            };

        var vacationRows =
            employee.Vacations
                .Select(
                    vacation =>
                        new EmployeeReportVacationRow
                        {
                            Id =
                                vacation.Id,

                            VacationType =
                                GetVacationTypeArabic(
                                    (int)vacation.VacationType),

                            StartDate =
                                vacation.StartDate,

                            EndDate =
                                vacation.StartDate.Date
                                    .AddDays(
                                        vacation.Duration - 1),

                            Duration =
                                vacation.Duration
                        })
                .ToList();

        report.DataSources.Add(
            new ReportDataSource(
                HeaderDataSetName,
                headerRows));

        report.DataSources.Add(
            new ReportDataSource(
                VacationDataSetName,
                vacationRows));

        report.SetParameters(
            new[]
            {
                new ReportParameter(
                    "EmployeeId",
                    employee.Id.ToString())
            });

        var rendered =
            format switch
            {
                ReportFormat.Pdf =>
                    new
                    {
                        Content =
                            report.Render("PDF"),

                        ContentType =
                            "application/pdf",

                        Extension =
                            "pdf"
                    },

                ReportFormat.Excel =>
                    new
                    {
                        Content =
                            report.Render(
                                "EXCELOPENXML"),

                        ContentType =
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

                        Extension =
                            "xlsx"
                    },

                _ =>
                    throw new ArgumentOutOfRangeException(
                        nameof(format),
                        format,
                        "Unsupported report format.")
            };

        return Task.FromResult(
            new ReportFileDto
            {
                Content =
                    rendered.Content,

                ContentType =
                    rendered.ContentType,

                FileName =
                    $"EmployeeReport-RDLC-{employee.EmployeeNumber}." +
                    rendered.Extension
            });
    }

    private static string GetQualificationArabic(
        int qualification)
    {
        return qualification switch
        {
            1 => "ثانوية عامة",
            2 => "متوسط",
            3 => "بكالوريوس",
            4 => "ماجستير",
            5 => "دكتوراه",
            _ => "غير محدد"
        };
    }

    private static string GetVacationTypeArabic(
        int vacationType)
    {
        return vacationType switch
        {
            1 => "سنوية",
            2 => "عارضة",
            3 => "مرضية",
            _ => "غير محددة"
        };
    }
}