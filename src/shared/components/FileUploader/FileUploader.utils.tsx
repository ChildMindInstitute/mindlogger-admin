import * as XLSX from 'xlsx';
import { Trans } from 'react-i18next';

import { DateFormats } from 'shared/consts';

export const importTable = async (file: File, isPrimaryUiType: boolean) => {
  const validFileTypes = isPrimaryUiType ? ['.csv', '.xls', '.xlsx', '.ods'] : ['.csv', '.xlsx'];
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!validFileTypes.includes(`.${fileExtension}`)) {
    throw new Error();
  }

  const fileBuffer = await new Response(file).arrayBuffer();
  const workbook = XLSX.read(fileBuffer, {
    cellDates: true,
    dateNF: `${DateFormats.DayMonthYear}`,
  });
  const worksheet = Object.values(workbook.Sheets)[0];
  const data = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: '' });
  if (!data.length) {
    throw new Error();
  }

  return data as Record<string, string | number>[];
};

export const getDropText = (isPrimaryUiType: boolean) =>
  isPrimaryUiType ? (
    <Trans i18nKey="dropFile">
      Drop <strong>.csv, .xls, .xlsx</strong> or <strong>.ods</strong> here or
      <em> click to browse</em>.
    </Trans>
  ) : (
    <Trans i18nKey="dropFileSecondary">
      Drop <strong>.csv</strong> or <strong>.xlsx</strong> here or
      <em> click to browse</em>.
    </Trans>
  );

export const getAcceptedFormats = (isPrimaryUiType: boolean) =>
  isPrimaryUiType ? '.csv, .xlsx, .xls, .ods' : '.csv, .xlsx';
