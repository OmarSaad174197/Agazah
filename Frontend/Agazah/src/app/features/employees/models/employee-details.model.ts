import { Vacation } from '../../vacations/models/vacation.model';

export interface EmployeeDetails {
    id: number;

    employeeNumber: string;

    employeeName: string;

    birthDate: string;

    qualification: string;

    totalVacationDays: number;

    vacations: Vacation[];
}
