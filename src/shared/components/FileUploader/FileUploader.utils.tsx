import { Trans } from 'react-i18next';

import { DateFormats } from 'shared/consts';
import {
  FileAcceptFormat,
  PrimaryAcceptFormats,
  SecondaryAcceptFormats,
} from 'shared/components/FileUploader/FileUploader.const';
import { variables } from 'shared/styles';

export const importTable = async (file: File, isPrimaryUiType: boolean) => {
  const validFileTypes = isPrimaryUiType ? ['.csv', '.xls', '.xlsx', '.ods'] : ['.csv', '.xlsx'];
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!validFileTypes.includes(`.${fileExtension}`)) {
    throw new Error();
  }

  const { read, utils } = await import('xlsx');
  const fileBuffer = await new Response(file).arrayBuffer();
  const workbook = read(fileBuffer, {
    cellDates: true,
    ...(fileExtension !== 'csv' && { dateNF: `${DateFormats.DayMonthYear}` }),
  });
  const worksheet = Object.values(workbook.Sheets)[0];
  const data = utils.sheet_to_json(worksheet, { raw: false, defval: '' });
  if (!data.length) {
    throw new Error();
  }

  return data as Record<string, string | number>[];
};

export const getDropText = ({ isPrimaryUiType, csvOnly }: { isPrimaryUiType: boolean; csvOnly?: boolean }) => {
  if (csvOnly)
    return (
      <Trans i18nKey="dropCsvFile">
        Drop <strong>.csv</strong> here or
        <em color={variables.palette.primary}>click to browse</em>.
      </Trans>
    );

  return isPrimaryUiType ? (
    <Trans i18nKey="dropFile">
      Drop <strong>.csv, .xls, .xlsx</strong> or <strong>.ods</strong> here or
      <em color={variables.palette.primary}> click to browse</em>.
    </Trans>
  ) : (
    <Trans i18nKey="dropFileSecondary">
      Drop <strong>.csv</strong> or <strong>.xlsx</strong> here or
      <em color={variables.palette.primary}> click to browse</em>.
    </Trans>
  );
};

export const getAcceptedFormats = ({ isPrimaryUiType, csvOnly }: { isPrimaryUiType: boolean; csvOnly?: boolean }) => {
  if (csvOnly) return FileAcceptFormat.Csv;

  return isPrimaryUiType ? PrimaryAcceptFormats.join(', ') : SecondaryAcceptFormats.join(', ');
};
