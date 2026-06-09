import { Qualification } from '../../../shared/enums/qualification.enum';

export interface CreateEmployee {
    employeeNumber: string;

    employeeName: string;

    birthDate: string;

    qualification: Qualification;
}
