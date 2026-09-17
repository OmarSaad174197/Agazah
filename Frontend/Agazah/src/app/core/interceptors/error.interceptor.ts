import {
  inject
} from '@angular/core';

import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import {
  catchError,
  from,
  switchMap,
  throwError
} from 'rxjs';

import {
  NotificationService
} from '../services/notification.service';

import {
  ApiError
} from '../models/api-error-model';


export const errorInterceptor: HttpInterceptorFn =
  (req, next) => {

    const notificationService =
      inject(NotificationService);

    return next(req).pipe(

      catchError(
        (error: HttpErrorResponse) => {

          return from(
            extractErrorMessage(error)
          ).pipe(

            switchMap(message => {

              notificationService.error(
                message
              );

              return throwError(
                () => error
              );
            })
          );
        }
      )
    );
  };


async function extractErrorMessage(
  error: HttpErrorResponse
): Promise<string> {

  const errorBody =
    await readErrorBody(error);


  if (errorBody) {

    const apiError =
      parseApiError(errorBody);

    if (apiError?.errors?.length) {

      return apiError.errors
        .map(translateBackendMessage)
        .join(' • ');
    }


    if (apiError?.message) {

      return translateBackendMessage(
        apiError.message
      );
    }
  }


  return getHttpErrorMessage(
    error.status
  );
}


async function readErrorBody(
  error: HttpErrorResponse
): Promise<unknown> {

  if (
    error.error instanceof Blob
  ) {

    try {

      const text =
        await error.error.text();

      if (!text) {
        return null;
      }

      return JSON.parse(text);

    } catch {

      return null;
    }
  }


  if (
    typeof error.error === 'string'
  ) {

    try {

      return JSON.parse(
        error.error
      );

    } catch {

      return {
        message:
          error.error
      };
    }
  }


  return error.error;
}


function parseApiError(
  value: unknown
): ApiError | null {

  if (
    typeof value !== 'object' ||
    value === null
  ) {

    return null;
  }


  const candidate =
    value as Partial<ApiError>;


  if (
    typeof candidate.message === 'string'
  ) {

    return {
      statusCode:
        typeof candidate.statusCode === 'number'
          ? candidate.statusCode
          : 0,

      message:
        candidate.message,

      errors:
        Array.isArray(candidate.errors)
          ? candidate.errors.filter(
              item =>
                typeof item === 'string'
            )
          : undefined,

      timestamp:
        typeof candidate.timestamp === 'string'
          ? candidate.timestamp
          : ''
    };
  }


  return null;
}


function translateBackendMessage(
  message: string
): string {

  switch (message.trim()) {

    case 'Employee number already exists':
      return 'رقم الموظف مستخدم بالفعل.';

    case 'Employee name already exists':
      return 'اسم الموظف مستخدم بالفعل.';

    case 'Employee not found':
      return 'الموظف غير موجود.';

    case 'Vacation overlaps with existing vacation':
      return 'الإجازة تتداخل مع إجازة موجودة بالفعل.';

    case 'Vacation yearly limit exceeded':
      return 'تم تجاوز الحد السنوي المسموح للإجازة.';

    case 'Report not found.':
      return 'التقرير غير موجود.';

    case 'SSRS report server URL is not configured.':
      return 'إعدادات خادم التقارير غير مكتملة.';

    case 'SSRS returned an empty report.':
      return 'خادم التقارير لم يُرجع أي بيانات.';

    case 'Unsupported report format.':
      return 'صيغة التقرير غير مدعومة.';

    default:
      return message;
  }
}


function getHttpErrorMessage(
  status: number
): string {

  switch (status) {

    case 0:
      return 'تعذر الاتصال بالخادم. تأكد من تشغيل النظام.';

    case 400:
      return 'البيانات المدخلة غير صحيحة.';

    case 401:
      return 'ليست لديك صلاحية المصادقة للوصول إلى هذه العملية.';

    case 403:
      return 'ليست لديك صلاحية لتنفيذ هذه العملية.';

    case 404:
      return 'العنصر المطلوب غير موجود.';

    case 500:
      return 'حدث خطأ داخلي في الخادم.';

    default:
      return 'حدث خطأ أثناء تنفيذ العملية.';
  }
}
