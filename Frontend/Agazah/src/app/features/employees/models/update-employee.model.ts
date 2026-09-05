import { Qualification } from '../../../shared/enums/qualification.enum';

export interface UpdateEmployee {
    employeeName: string;

    birthDate: string;

    qualification: Qualification;
}
