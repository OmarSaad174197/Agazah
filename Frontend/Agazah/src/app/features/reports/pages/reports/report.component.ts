import {
  Component,
  OnDestroy,
  inject
} from '@angular/core';

import {
  isPlatformBrowser
} from '@angular/common';

import {
  PLATFORM_ID
} from '@angular/core';

import {
  DomSanitizer,
  SafeResourceUrl
} from '@angular/platform-browser';

import {
  finalize
} from 'rxjs';

import {
  ReportService
} from '../../services/report.service';

import {
  ReportFormat
} from '../../models/report-format.type';

import {
  MATERIAL_MODULES
} from '../../../../shared/material/material.imports';


@Component({
  selector: 'app-reports',

  standalone: true,

  imports: [
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './report.component.html',

  styleUrl:
    './report.component.css'
})
export class ReportsComponent
  implements OnDestroy {

  private readonly reportService =
    inject(ReportService);

  private readonly sanitizer =
    inject(DomSanitizer);

  private readonly platformId =
    inject(PLATFORM_ID);


  isLoading = false;

  reportUrl:
    SafeResourceUrl | null =
    null;


  private reportObjectUrl:
    string | null =
    null;


  viewEmployeeReport(): void {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {
      return;
    }


    this.clearReportPreview();

    this.isLoading = true;


    this.reportService
      .getEmployeeReport('PDF')
      .pipe(
        finalize(() => {

          this.isLoading = false;
        })
      )
      .subscribe({

        next: blob => {

          this.reportObjectUrl =
            URL.createObjectURL(
              blob
            );


          this.reportUrl =
            this.sanitizer
              .bypassSecurityTrustResourceUrl(
                this.reportObjectUrl
              );
        },

        error: () => {
        }
      });
  }


  downloadEmployeeReport(
    format: ReportFormat
  ): void {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {
      return;
    }


    this.isLoading = true;


    this.reportService
      .getEmployeeReport(format)
      .pipe(
        finalize(() => {

          this.isLoading = false;
        })
      )
      .subscribe({

        next: blob => {

          const extension =
            format === 'PDF'
              ? 'pdf'
              : 'xlsx';


          const fileName =
            `تقرير-الموظفين.${extension}`;


          const objectUrl =
            URL.createObjectURL(
              blob
            );


          const anchor =
            document.createElement(
              'a'
            );


          anchor.href =
            objectUrl;

          anchor.download =
            fileName;

          anchor.click();


          URL.revokeObjectURL(
            objectUrl
          );
        },

        error: () => {

          // الخطأ يعرضه الـInterceptor.
        }
      });
  }


  clearReportPreview(): void {

    if (this.reportObjectUrl) {

      URL.revokeObjectURL(
        this.reportObjectUrl
      );

      this.reportObjectUrl = null;
    }


    this.reportUrl = null;
  }


  ngOnDestroy(): void {

    this.clearReportPreview();
  }
}
