import i18n from 'i18next';
import { HeadCell } from 'shared/types';
import { createArray, getTableCell } from 'shared/utils';
import { FlankerStimulusSettings } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.types';
import { Row } from 'shared/components';
import { UploadedTable } from './BlockSequencesContent.types';

const { t } = i18n;

const DEFAULT_SEQUENCES_TABLE_COLUMNS = 4;

export const getSequencesData = (stimulusTrials: FlankerStimulusSettings[] = []) => {
  const defaultExportTable: Record<string, string>[] = [];
  const defaultTableRows: Row[] = [];

  for (const trial of stimulusTrials) {
    if (trial?.imageName) {
      const exportRow: Record<string, string> = {};
      const tableRow: Row = {};

      for (let index = 0; index < DEFAULT_SEQUENCES_TABLE_COLUMNS; index++) {
        exportRow[`${t('flankerRound.block')} ${index + 1}`] = trial.imageName;
        tableRow[`block-${index + 1}`] = getTableCell(trial.imageName);
      }

      defaultExportTable.push(exportRow);
      defaultTableRows.push(tableRow);
    }
  }

  return { defaultExportTable, defaultTableRows };
};

export const getSequencesHeadCells = (uploadedTable: UploadedTable | null): HeadCell[] =>
  uploadedTable
    ? Object.keys(uploadedTable[0]).map((key) => ({
        id: key.toLowerCase().replace(/\s+/g, '-'),
        label: key,
      }))
    : createArray(DEFAULT_SEQUENCES_TABLE_COLUMNS, (index) => ({
        id: `block-${index + 1}`,
        label: `${t('flankerRound.block')} ${index + 1}`,
      }));

export const getUploadedTableRows = (uploadedTable: UploadedTable) =>
  uploadedTable?.map((obj) => {
    const updatedObj: Row = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        updatedObj[key] = getTableCell(obj[key]);
      }
    }

    return updatedObj;
  });

export const getRoundBlocks = (
  stimulusTrials: FlankerStimulusSettings[],
  uploadedTable: UploadedTable,
) => {
  if (!uploadedTable?.length) return;

  const imagesIds = stimulusTrials.reduce((result: Record<string, string>, item) => {
    result[item.imageName] = item.id;

    return result;
  }, {});

  return Object.keys(uploadedTable[0]).reduce((result: { order: (string | number)[] }[], key) => {
    result.push({
      order: uploadedTable.map((obj) => imagesIds[obj[key]]),
    });

    return result;
  }, []);
};
