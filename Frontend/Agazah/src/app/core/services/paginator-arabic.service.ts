import {
  MatPaginatorIntl
}
from '@angular/material/paginator';

export function getArabicPaginator(): MatPaginatorIntl {

  const paginator =
    new MatPaginatorIntl();

  paginator.itemsPerPageLabel =
    'عدد العناصر في الصفحة';

  paginator.nextPageLabel =
    'الصفحة التالية';

  paginator.previousPageLabel =
    'الصفحة السابقة';

  paginator.firstPageLabel =
    'الصفحة الأولى';

  paginator.lastPageLabel =
    'الصفحة الأخيرة';

  paginator.getRangeLabel =
    (
      page: number,
      pageSize: number,
      length: number
    ) => {

      if (length === 0) {

        return '0 من 0';
      }

      const start =
        page * pageSize + 1;

      const end =
        Math.min(
          start + pageSize - 1,
          length
        );

      return `${start} - ${end} من ${length}`;
    };

  return paginator;
}
