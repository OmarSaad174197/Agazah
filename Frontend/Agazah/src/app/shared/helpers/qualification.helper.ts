import { Qualification }
from '../enums/qualification.enum';

export function getQualificationName(
  qualification: Qualification
): string {

  switch (qualification) {

    case Qualification.HighSchool:
      return 'ثانوية عامة';

    case Qualification.Diploma:
      return 'متوسط';

    case Qualification.Bachelor:
      return 'بكالوريوس';

    case Qualification.Master:
      return 'ماجستير';

    case Qualification.PhD:
      return 'دكتوراه';

    default:
      return '-';
  }
}
