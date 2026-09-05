import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import {
  inject
} from '@angular/core';

import {
  catchError,
  throwError
} from 'rxjs';

import {
  ApiError
} from '../models/api-error-model';

import {
  NotificationService
} from '../services/notification.service';

function toArabicMessage(
  error: HttpErrorResponse
): string {
  const apiError = error.error as ApiError | null;

  if (apiError?.message) {
    switch (apiError.message) {
      case 'Employee number already exists':
        return 'رقم الموظف موجود بالفعل.';
      case 'Employee name already exists':
        return 'اسم الموظف موجود بالفعل.';
      case 'Employee not found':
        return 'لم يتم العثور على الموظف المطلوب.';
      case 'Vacation not found':
        return 'لم يتم العثور على الإجازة المطلوبة.';
      case 'Vacation yearly limit exceeded':
        return 'لا يمكن إضافة الإجازة لأن الحد السنوي لهذا النوع هو 30 يومًا.';
      case 'Vacation overlaps with existing vacation':
        return 'لا يمكن إضافة الإجازة لأنها تتداخل مع إجازة مسجلة لنفس الموظف.';
      case 'Validation failed.':
        return 'البيانات المدخلة غير صحيحة.';
      case 'An unexpected error occurred.':
        return 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
      default:
        return apiError.message;
    }
  }

  switch (error.status) {
    case 0:
      return 'تعذر الاتصال بالخادم. تأكد من تشغيل النظام.';
    case 400:
      return 'البيانات المدخلة غير صحيحة.';
    case 404:
      return 'العنصر المطلوب غير موجود.';
    case 500:
      return 'حدث خطأ داخلي في الخادم.';
    default:
      return 'حدث خطأ أثناء تنفيذ العملية.';
  }
}

export const errorInterceptor: HttpInterceptorFn =
  (req, next) => {
    const notificationService =
      inject(NotificationService);

    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const apiError = error.error as ApiError | null;

        let message = toArabicMessage(error);

        if (apiError?.errors?.length) {
          message = 'البيانات المدخلة غير صحيحة.';
        }

        notificationService.error(message);

        return throwError(() => error);
      })
    );
  };
