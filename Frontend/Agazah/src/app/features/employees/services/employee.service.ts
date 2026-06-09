import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { Employee } from '../models/employee.model';

import { EmployeeDetails } from '../models/employee-details.model';

import { CreateEmployee } from '../models/create-employee.model';

import { UpdateEmployee } from '../models/update-employee.model';

import { PagedResult } from '../../../core/models/paged-result.model';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {

    private readonly http =
        inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/employees`;

    getPaged(
        pageNumber: number,
        pageSize: number
    ): Observable<PagedResult<Employee>> {

        return this.http.get<PagedResult<Employee>>(
            this.apiUrl,
            {
                params: {
                    pageNumber,
                    pageSize
                }
            });
    }

    getById(
        id: number
    ): Observable<EmployeeDetails> {

        return this.http.get<EmployeeDetails>(
            `${this.apiUrl}/${id}`);
    }

    create(
        dto: CreateEmployee
    ): Observable<number> {

        return this.http.post<number>(
            this.apiUrl,
            dto);
    }

    update(
        id: number,
        dto: UpdateEmployee
    ): Observable<void> {

        return this.http.put<void>(
            `${this.apiUrl}/${id}`,
            dto);
    }

    delete(
        id: number
    ): Observable<void> {

        return this.http.delete<void>(
            `${this.apiUrl}/${id}`);
    }
}
