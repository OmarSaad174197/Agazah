import {
  VacationType
} from '../enums/vacation-type.enum';

export function getVacationTypeName(
  vacationType: VacationType
): string {
  switch (vacationType) {
    case VacationType.Annual:
      return 'سنوية';

    case VacationType.Sick:
      return 'مرضية';

    case VacationType.Emergency:
      return 'طارئة';

    default:
      return '-';
  }
}

export function getVacationTypeBadgeClass(
  vacationType: VacationType
): string {
  switch (vacationType) {
    case VacationType.Annual:
      return 'annual';

    case VacationType.Sick:
      return 'sick';

    case VacationType.Emergency:
      return 'emergency';

    default:
      return '';
  }
}
