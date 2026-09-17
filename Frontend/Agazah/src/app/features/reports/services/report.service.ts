import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  environment
} from '../../../../environments/environment';

import {
  ReportFormat
} from '../models/report-format.type';


@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/reports`;


  getEmployeeReport(
    format: ReportFormat
  ): Observable<Blob> {

    const params =
      new HttpParams()
        .set('format', format);

    return this.http.get(
      `${this.apiUrl}/employees`,
      {
        params,
        responseType: 'blob'
      }
    );
  }
}
