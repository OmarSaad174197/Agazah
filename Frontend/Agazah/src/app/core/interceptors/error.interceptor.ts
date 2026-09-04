import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import { catchError, throwError } from 'rxjs';

import { NotificationService }
  from '../services/notification.service';

import { ApiError }
  from '../models/api-error-model';

export const errorInterceptor: HttpInterceptorFn =
  (req, next) => {

    const notificationService =
      inject(NotificationService);

    return next(req).pipe(

      catchError((error: HttpErrorResponse) => {

        const apiError =
          error.error as ApiError | null;

        let message =
          'حدث خطأ غير متوقع، حاول مرة أخرى.';

        if (apiError?.errors?.length) {

          message =
            apiError.errors.join('\n');

        } else if (apiError?.message) {

          message =
            apiError.message;

        } else {

          switch (error.status) {

            case 0:
              message =
                'تعذر الاتصال بالخادم. تأكد من تشغيل النظام.';

              break;

            case 400:
              message =
                'البيانات المدخلة غير صحيحة.';

              break;

            case 404:
              message =
                'العنصر المطلوب غير موجود.';

              break;

            case 500:
              message =
                'حدث خطأ داخلي في الخادم.';

              break;
          }
        }

        notificationService.error(message);

        return throwError(() => error);
      })
    );
  };
