using System.Net;
using Agazah.Application.DTOs.Reports;
using Agazah.Application.Exceptions;
using Agazah.Application.Interfaces.Reports;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Agazah.Infrastructure.Reporting;

public sealed class SsrsReportClient
    : ISsrsReportClient
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
        string format,
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

        var normalizedFormat =
            format.Trim().ToUpperInvariant();

        var contentType =
            normalizedFormat switch
            {
                "PDF" =>
                    "application/pdf",

                "EXCEL" =>
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

                "HTML5" =>
                    "text/html",

                "HTML4.0" =>
                    "text/html",

                _ =>
                    throw new ArgumentException(
                        "Unsupported report format.",
                        nameof(format))
            };

        var extension =
            normalizedFormat switch
            {
                "PDF" => "pdf",
                "EXCEL" => "xlsx",
                "HTML5" => "html",
                "HTML4.0" => "html",
                _ => "bin"
            };

        var reportServerUrl =
            _options.ReportServerUrl
                .TrimEnd('/');

        var url =
            $"{reportServerUrl}" +
            $"?{reportPath}" +
            $"&rs:Command=Render" +
            $"&rs:Format={Uri.EscapeDataString(normalizedFormat)}";

        _logger.LogInformation(
            "Rendering SSRS report {ReportPath} in format {Format}.",
            reportPath,
            normalizedFormat);

        using var response =
            await _httpClient.GetAsync(
                url,
                HttpCompletionOption.ResponseHeadersRead,
                cancellationToken);

        if (
            response.StatusCode ==
            HttpStatusCode.Unauthorized)
        {
            _logger.LogError(
                "SSRS returned 401 Unauthorized for report {ReportPath}.",
                reportPath);

            throw new UnauthorizedAccessException(
                "SSRS authentication failed.");
        }

        if (
            response.StatusCode ==
            HttpStatusCode.Forbidden)
        {
            _logger.LogError(
                "SSRS returned 403 Forbidden for report {ReportPath}.",
                reportPath);

            throw new UnauthorizedAccessException(
                "Access to the SSRS report was denied.");
        }

        if (
            response.StatusCode ==
            HttpStatusCode.NotFound)
        {
            _logger.LogError(
                "SSRS report {ReportPath} was not found.",
                reportPath);

            throw new NotFoundException(
                "Report not found.");
        }

        if (!response.IsSuccessStatusCode)
        {
            var errorBody =
                await response.Content.ReadAsStringAsync(
                    cancellationToken);

            _logger.LogError(
                "SSRS report request failed. " +
                "StatusCode: {StatusCode}. " +
                "ReportPath: {ReportPath}. " +
                "Response: {Response}",
                (int)response.StatusCode,
                reportPath,
                errorBody);

            throw new InvalidOperationException(
                "SSRS report generation failed.");
        }

        var content =
            await response.Content
                .ReadAsByteArrayAsync(
                    cancellationToken);

        if (content.Length == 0)
        {
            _logger.LogError(
                "SSRS returned an empty response for {ReportPath}.",
                reportPath);

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