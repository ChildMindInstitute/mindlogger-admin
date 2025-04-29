import { format } from 'date-fns';

import { ExportDateType } from 'shared/features/AppletSettings/ExportDataSetting/ExportDataSetting.types';
import { getNormalizedTimezoneDate } from 'shared/utils/dateTimezone';
import { DateFormats } from 'shared/consts';

import { getFormattedToDate } from 'shared/features/AppletSettings/ExportDataSetting/Popups/DataExportPopup/DataExportPopup.utils';

describe('getFormattedToDate', () => {
  const utcDate = getNormalizedTimezoneDate(new Date().toString());
  const formattedUtcDate = format(utcDate, DateFormats.shortISO);
  const formToDate = new Date('2023-06-22T00:00:00Z');

  test.each([
    { dateType: undefined, formToDate: new Date('2023-06-22T00:00:00Z'), expected: undefined },
    { dateType: ExportDateType.ChooseDates, formToDate: undefined, expected: undefined },
    {
      dateType: ExportDateType.AllTime,
      formToDate,
      expected: formattedUtcDate,
    },
    {
      dateType: ExportDateType.Last24h,
      formToDate,
      expected: formattedUtcDate,
    },
    {
      dateType: ExportDateType.LastMonth,
      formToDate,
      expected: formattedUtcDate,
    },
    {
      dateType: ExportDateType.ChooseDates,
      formToDate,
      expected: format(formToDate, DateFormats.shortISO),
    },
    {
      dateType: ExportDateType.ChooseDates,
      formToDate: getNormalizedTimezoneDate(new Date().toString()),
      expected: formattedUtcDate,
    },
  ])(
    'returns $expected when dateType is $dateType and formToDate is $formToDate',
    ({ dateType, formToDate, expected }) => {
      const result = getFormattedToDate({ dateType, formToDate });
      const resultWithoutSeconds = result ? result.slice(0, -3) : result;
      const expectedWithoutSeconds = expected ? expected.slice(0, -3) : expected;

      expect(resultWithoutSeconds).toBe(expectedWithoutSeconds);
    },
  );
});
