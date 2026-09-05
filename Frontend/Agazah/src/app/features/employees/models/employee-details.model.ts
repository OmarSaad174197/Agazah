import { Qualification } from '../../../shared/enums/qualification.enum';
import { Vacation } from '../../vacations/models/vacation.model';

export interface EmployeeDetails {
    id: number;

    employeeNumber: string;

    employeeName: string;

    birthDate: string;

    qualification: Qualification;

    totalVacationDays: number;

    vacations: Vacation[];
}
