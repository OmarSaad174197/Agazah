import { VacationType }
from '../../../shared/enums/vacation-type.enum';

export interface Vacation {

    id: number;

    employeeId: number;

    employeeName: string;

    vacationType: VacationType;

    startDate: string;

    duration: number;
}
