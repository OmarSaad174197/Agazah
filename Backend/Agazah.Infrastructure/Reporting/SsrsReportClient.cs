using System.Net;
using Agazah.Application.DTOs.Reports;
using Agazah.Application.Exceptions;
using Agazah.Application.Interfaces.Reports;
using Agazah.Domain.Enums.ReportEngine;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Agazah.Infrastructure.Reporting;

public sealed class SsrsReportClient : ISsrsReportClient
{
    private readonly HttpClient _httpClient;
    private readonly SsrsOptions _options;
    private readonly ILogger<SsrsReportClient> _logger;

    public SsrsReportClient(
        HttpClient httpClient,
        IOptions<SsrsOptions> options,
        ILogger<SsrsReportClient> logger)
    {
        _httpClient = httpClient;
        _options = options.Value;
        _logger = logger;
    }

    public async Task<ReportFileDto> RenderAsync(
        string reportPath,
        IReadOnlyDictionary<string, string> parameters,
        ReportFormat format,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(
            _options.ReportServerUrl))
        {
            throw new InvalidOperationException(
                "SSRS report server URL is not configured.");
        }

        if (string.IsNullOrWhiteSpace(reportPath))
        {
            throw new ArgumentException(
                "Report path is required.",
                nameof(reportPath));
        }

        var ssrsFormat =
            format switch
            {
                ReportFormat.Pdf =>
                    "PDF",

                ReportFormat.Excel =>
                    "EXCEL",

                _ =>
                    throw new ArgumentOutOfRangeException(
                        nameof(format),
                        format,
                        "Unsupported report format.")
            };

        var contentType =
            format switch
            {
                ReportFormat.Pdf =>
                    "application/pdf",

                ReportFormat.Excel =>
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

                _ =>
                    throw new ArgumentOutOfRangeException(
                        nameof(format),
                        format,
                        "Unsupported report format.")
            };

        var extension =
            format switch
            {
                ReportFormat.Pdf => "pdf",
                ReportFormat.Excel => "xlsx",

                _ =>
                    throw new ArgumentOutOfRangeException(
                        nameof(format),
                        format,
                        "Unsupported report format.")
            };

        var reportServerUrl =
            _options.ReportServerUrl.TrimEnd('/');

        var normalizedReportPath =
            string.Join(
                "/",
                reportPath
                    .Trim('/')
                    .Split(
                        '/',
                        StringSplitOptions.RemoveEmptyEntries)
                    .Select(Uri.EscapeDataString));

        var query =
            new List<string>();

        foreach (
            var parameter in parameters)
        {
            query.Add(
                $"{Uri.EscapeDataString(parameter.Key)}=" +
                $"{Uri.EscapeDataString(parameter.Value)}");
        }

        query.Add("rs:Command=Render");

        query.Add(
            $"rs:Format={Uri.EscapeDataString(ssrsFormat)}");

        var url =
            $"{reportServerUrl}" +
            $"?/{normalizedReportPath}" +
            $"&{string.Join("&", query)}";

        _logger.LogInformation(
            "Rendering SSRS report {ReportPath} " +
            "using format {Format}.",
            reportPath,
            ssrsFormat);

        using var response =
            await _httpClient.GetAsync(
                url,
                HttpCompletionOption.ResponseHeadersRead,
                cancellationToken);

        if (
            response.StatusCode ==
            HttpStatusCode.Unauthorized)
        {
            throw new UnauthorizedAccessException(
                "SSRS authentication failed.");
        }

        if (
            response.StatusCode ==
            HttpStatusCode.Forbidden)
        {
            throw new UnauthorizedAccessException(
                "Access to the SSRS report was denied.");
        }

        if (
            response.StatusCode ==
            HttpStatusCode.NotFound)
        {
            throw new NotFoundException(
                "Report not found.");
        }

        if (!response.IsSuccessStatusCode)
        {
            var body =
                await response.Content
                    .ReadAsStringAsync(
                        cancellationToken);

            _logger.LogError(
                "SSRS returned {StatusCode}. " +
                "ReportPath: {ReportPath}. " +
                "Response: {Response}",
                (int)response.StatusCode,
                reportPath,
                body);

            throw new InvalidOperationException(
                "SSRS report generation failed.");
        }

        var content =
            await response.Content
                .ReadAsByteArrayAsync(
                    cancellationToken);

        if (content.Length == 0)
        {
            throw new InvalidOperationException(
                "SSRS returned an empty report.");
        }

        return new ReportFileDto
        {
            Content = content,

            ContentType =
                contentType,

            FileName =
                $"EmployeeReport.{extension}"
        };
    }
}