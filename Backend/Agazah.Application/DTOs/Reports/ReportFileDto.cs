using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agazah.Application.DTOs.Reports
{
    public sealed class ReportFileDto
    {
        public required byte[] Content { get; init; }

        public required string ContentType { get; init; }

        public required string FileName { get; init; }
    }
}
