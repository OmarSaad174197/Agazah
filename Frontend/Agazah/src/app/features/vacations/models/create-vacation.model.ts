import {
  VacationType
} from '../../../shared/enums/vacation-type.enum';

export interface CreateVacation {
  employeeId: number;

  vacationType: VacationType;

  startDate: string;

  duration: number;
}
