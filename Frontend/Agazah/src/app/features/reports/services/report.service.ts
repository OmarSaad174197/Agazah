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
  ReportEngine
} from '../models/report-engine.type';

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
    employeeId: number,
    engine: ReportEngine,
    format: ReportFormat
  ): Observable<Blob> {

    const params =
      new HttpParams()
        .set('engine', engine)
        .set('format', format);


    return this.http.get(
      `${this.apiUrl}/employees/${employeeId}`,
      {
        params,

        responseType: 'blob'
      }
    );
  }
}
