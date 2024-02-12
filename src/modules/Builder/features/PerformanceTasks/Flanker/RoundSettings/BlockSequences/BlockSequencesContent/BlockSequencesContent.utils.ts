import i18n from 'i18n';
import { Row } from 'shared/components';
import { HeadCell } from 'shared/types';
import { createArray, getTableCell } from 'shared/utils';
import { FlankerStimulusSettings, FlankerBlockSettings } from 'shared/state';
import { getUploadedMediaName } from 'modules/Builder/utils';

import { UploadedData, UploadedDataOrNull } from './BlockSequencesContent.types';

const { t } = i18n;

const DEFAULT_SEQUENCES_TABLE_COLUMNS = 4;

export const getSequencesData = (stimulusTrials: FlankerStimulusSettings[] = []) => {
  const defaultExportTable: Record<string, string>[] = [];
  const defaultTableRows: Row[] = [];

  for (const trial of stimulusTrials) {
    if (trial && (trial.image || trial.text)) {
      const imageName = trial.text || getUploadedMediaName(trial.image);
      const exportRow: Record<string, string> = {};
      const tableRow: Row = {};

      for (let index = 0; index < DEFAULT_SEQUENCES_TABLE_COLUMNS; index++) {
        exportRow[`${t('flankerRound.block')} ${index + 1}`] = imageName;
        tableRow[`block-${index + 1}`] = getTableCell(imageName);
      }

      defaultExportTable.push(exportRow);
      defaultTableRows.push(tableRow);
    }
  }

  return { defaultExportTable, defaultTableRows };
};

export const getSequencesHeadCells = (uploadedData?: UploadedDataOrNull): HeadCell[] =>
  uploadedData
    ? Object.keys(uploadedData[0]).map((label) => ({
        id: label.toLowerCase().replace(/\s+/g, '-'),
        label,
      }))
    : createArray(DEFAULT_SEQUENCES_TABLE_COLUMNS, (index) => ({
        id: `block-${index + 1}`,
        label: `${t('flankerRound.block')} ${index + 1}`,
      }));

export const getUploadedTableRows = (uploadedData?: UploadedDataOrNull) =>
  uploadedData?.map((obj) => {
    const updatedObj: Row = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        updatedObj[key] = getTableCell(obj[key].text);
      }
    }

    return updatedObj;
  });

export const getStimulusObject = (stimulusTrials: FlankerStimulusSettings[], type: 'imageKey' | 'idKey') =>
  stimulusTrials?.reduce((result: Record<string, string>, item) => {
    const trialName = item.text || getUploadedMediaName(item.image);
    const key = type === 'imageKey' ? trialName : item.id;
    const value = type === 'imageKey' ? item.id : trialName;

    return { ...result, [key]: value };
  }, {});

export const getRoundBlocks = (stimulusTrials: FlankerStimulusSettings[], uploadedData?: UploadedDataOrNull) => {
  if (!uploadedData?.length) return;

  return Object.keys(uploadedData[0]).reduce((result: { order: string[]; name: string }[], key) => {
    result.push({
      order: uploadedData.map((obj) => obj?.[key]?.id),
      name: key,
    });

    return result;
  }, []);
};

export const getTableFromSequences = (
  stimulusTrials: FlankerStimulusSettings[],
  blockSequences: FlankerBlockSettings[],
) => {
  if (!blockSequences?.length) return;
  const imagesNames = getStimulusObject(stimulusTrials, 'idKey');

  return blockSequences.reduce((result: UploadedData, { name, order }) => {
    order.forEach((id, index) => {
      if (!result[index]) {
        result[index] = {};
      }
      result[index][name] = { id, text: imagesNames[id] };
    });

    return result;
  }, []);
};

export const getExportData = (uploadedData?: UploadedDataOrNull) =>
  uploadedData?.map((obj) => {
    const transformedObj: Record<string, string> = {};
    Object.keys(obj).forEach((key) => {
      transformedObj[key] = obj[key].text;
    });

    return transformedObj;
  });
