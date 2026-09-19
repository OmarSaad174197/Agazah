import {
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';

import {
  isPlatformBrowser
} from '@angular/common';

import {
  PLATFORM_ID
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

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
  ReportEngine
} from '../../models/report-engine.type';

import {
  ReportFormat
} from '../../models/report-format.type';

import {
  MATERIAL_MODULES
} from '../../../../shared/material/material.imports';


@Component({
  selector: 'app-employee-report',

  standalone: true,

  imports: [
    ...MATERIAL_MODULES
  ],

  templateUrl:
    './employee-report.component.html',

  styleUrl:
    './employee-report.component.css'
})
export class EmployeeReportComponent
  implements OnInit, OnDestroy {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly reportService =
    inject(ReportService);

  private readonly sanitizer =
    inject(DomSanitizer);

  private readonly platformId =
    inject(PLATFORM_ID);


  employeeId = 0;

  selectedEngine:
    ReportEngine = 'Rdl';


  isLoading = false;


  reportUrl:
    SafeResourceUrl | null = null;


  private objectUrl:
    string | null = null;


  ngOnInit(): void {

    const id =
      Number(
        this.route.snapshot.paramMap.get(
          'employeeId'
        )
      );


    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {

      this.goBack();

      return;
    }


    this.employeeId = id;
  }


  selectEngine(
    engine: ReportEngine
  ): void {

    if (this.isLoading) {
      return;
    }


    this.selectedEngine =
      engine;


    this.clearPreview();
  }


  viewReport(): void {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {
      return;
    }


    this.clearPreview();

    this.isLoading = true;


    this.reportService
      .getEmployeeReport(
        this.employeeId,
        this.selectedEngine,
        'PDF'
      )
      .pipe(
        finalize(() => {

          this.isLoading = false;
        })
      )
      .subscribe({

        next: blob => {

          this.objectUrl =
            URL.createObjectURL(
              blob
            );


          this.reportUrl =
            this.sanitizer
              .bypassSecurityTrustResourceUrl(
                this.objectUrl
              );
        },

        error: () => {

          // يتم عرض الخطأ بواسطة interceptor.
        }
      });
  }


  download(
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
      .getEmployeeReport(
        this.employeeId,
        this.selectedEngine,
        format
      )
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


          const engineName =
            this.selectedEngine === 'Rdl'
              ? 'RDL'
              : 'RDLC';


          const fileName =
            `تقرير-الموظف-${this.employeeId}-${engineName}.${extension}`;


          const url =
            URL.createObjectURL(blob);


          const anchor =
            document.createElement('a');


          anchor.href =
            url;

          anchor.download =
            fileName;


          document.body
            .appendChild(anchor);

          anchor.click();

          anchor.remove();


          URL.revokeObjectURL(url);
        },

        error: () => {

          // يتم عرض الخطأ بواسطة interceptor.
        }
      });
  }


  clearPreview(): void {

    if (this.objectUrl) {

      URL.revokeObjectURL(
        this.objectUrl
      );

      this.objectUrl = null;
    }


    this.reportUrl = null;
  }


  goBack(): void {

    this.router.navigate([
      '/employees'
    ]);
  }


  ngOnDestroy(): void {

    this.clearPreview();
  }
}
