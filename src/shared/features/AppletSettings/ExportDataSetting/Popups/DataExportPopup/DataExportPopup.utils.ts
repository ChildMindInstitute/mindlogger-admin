import { format } from 'date-fns';

import { ExportDateType } from 'shared/features/AppletSettings/ExportDataSetting/ExportDataSetting.types';
import { getNormalizedTimezoneDate } from 'shared/utils';
import { DateFormats } from 'shared/consts';

import { GetFormattedToDate } from 'shared/features/AppletSettings/ExportDataSetting/Popups/DataExportPopup/DataExportPopup.types';

export const getExportDataSuffix = (page: number) => `_response_${page}`;

export const getFormattedToDate = ({
  dateType,
  formToDate,
}: GetFormattedToDate): string | undefined => {
  if (!dateType) return undefined;

  const utcDate = getNormalizedTimezoneDate(new Date().toString());
  const formattedUtcDate = format(utcDate, DateFormats.shortISO);

  if (dateType !== ExportDateType.ChooseDates) {
    return formattedUtcDate;
  } else if (formToDate) {
    return format(formToDate, DateFormats.DayMonthYear) ===
      format(utcDate, DateFormats.DayMonthYear)
      ? formattedUtcDate
      : format(formToDate, DateFormats.shortISO);
  }

  return undefined;
};
