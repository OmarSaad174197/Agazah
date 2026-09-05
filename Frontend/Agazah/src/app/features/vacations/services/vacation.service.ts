import {
  HttpClient
} from '@angular/common/http';

import {
  Injectable,
  inject
} from '@angular/core';

import {
  Observable
} from 'rxjs';

import {
  environment
} from '../../../../environments/environment';

import {
  CreateVacation
} from '../models/create-vacation.model';

import {
  Vacation
} from '../models/vacation.model';

@Injectable({
  providedIn: 'root'
})
export class VacationService {
  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/vacation`;

  create(
    dto: CreateVacation
  ): Observable<number> {
    return this.http.post<number>(
      this.apiUrl,
      dto
    );
  }

  getByEmployeeId(
    employeeId: number
  ): Observable<Vacation[]> {
    return this.http.get<Vacation[]>(
      `${this.apiUrl}/employee/${employeeId}`
    );
  }

  delete(
    vacationId: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${vacationId}`
    );
  }
}
