import { Qualification } from '../../../shared/enums/qualification.enum';

export interface Employee {
    id: number;

    employeeNumber: string;

    employeeName: string;

    birthDate: string;

    qualification: Qualification;

    totalVacationDays: number;
}
