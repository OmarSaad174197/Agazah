using Agazah.Application.DTOs.Reports;
using Agazah.Application.Exceptions;
using Agazah.Application.Interfaces.Reports;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Agazah.Infrastructure.Reporting
{
    public sealed class SsrsReportClient : ISsrsReportClient
    {
        private readonly HttpClient _httpClient;
        private readonly SsrsOptions _options;

        public SsrsReportClient(
            HttpClient httpClient,
            IOptions<SsrsOptions> options)
        {
            _httpClient = httpClient;
            _options = options.Value;
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

            var encodedPath =
                Uri.EscapeDataString(
                    reportPath);

            var url =
                $"{_options.ReportServerUrl}" +
                $"?{encodedPath}" +
                $"&rs:Command=Render" +
                $"&rs:Format={Uri.EscapeDataString(normalizedFormat)}";

            using var response =
                await _httpClient.GetAsync(
                    url,
                    HttpCompletionOption.ResponseHeadersRead,
                    cancellationToken);

            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                throw new NotFoundException(
                    "Report not found.");
            }

            if (!response.IsSuccessStatusCode)
            {
                throw new InvalidOperationException(
                    $"SSRS returned HTTP {(int)response.StatusCode}.");
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

            var extension =
                normalizedFormat switch
                {
                    "PDF" => "pdf",
                    "EXCEL" => "xlsx",
                    "HTML5" => "html",
                    "HTML4.0" => "html",
                    _ => "bin"
                };

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
}
