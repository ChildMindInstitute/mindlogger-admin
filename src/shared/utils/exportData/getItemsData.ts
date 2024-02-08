import { ItemResponseType } from 'shared/consts';
import {
  AnswerWithWrapper,
  AppletExportData,
  DecryptedABTrailsAnswer,
  DecryptedAnswerData,
  DecryptedDrawingAnswer,
  DecryptedFlankerAnswerItemValue,
  DecryptedStabilityTrackerAnswer,
  DecryptedStabilityTrackerAnswerObject,
  ExportCsvData,
} from 'shared/types';
import { convertDateStampToMs } from 'shared/utils/exportData/convertDateStampToMs';
import { getABTrailsRecords } from 'shared/utils/exportData/getABTrailsRecords';
import { checkIfShouldScaleCoords, getDrawingLines } from 'shared/utils/exportData/getDrawingLines';
import { getFlankerRecords } from 'shared/utils/exportData/getFlankerRecords';
import {
  getABTrailsCsvName,
  getFlankerCsvName,
  getMediaFileName,
  getStabilityTrackerCsvName,
} from 'shared/utils/exportData/getReportName';
import { getStabilityRecords } from 'shared/utils/exportData/getStabilityRecords';
import { convertJsonToCsv } from 'shared/utils/exportTemplate';

export const getDrawingItemsData = async (
  drawingItemsData: AppletExportData['drawingItemsData'],
  decryptedAnswers: DecryptedAnswerData[],
) => {
  const data: ExportCsvData[] = [];
  for await (const item of decryptedAnswers) {
    const responseType = item.activityItem?.responseType;
    if (responseType !== ItemResponseType.Drawing || !item.answer) continue;

    const drawingValue = (item.answer as DecryptedDrawingAnswer).value;
    const shouldScaleCoords = checkIfShouldScaleCoords(item.client);
    data.push({
      name: getMediaFileName(item, 'csv'),
      data: await convertJsonToCsv(getDrawingLines(drawingValue.lines, drawingValue.width || 100, shouldScaleCoords)),
    });
  }

  return drawingItemsData.concat(data);
};

export const getStabilityTrackerItemsData = async (
  stabilityTrackerItemsData: AppletExportData['stabilityTrackerItemsData'],
  decryptedAnswers: DecryptedAnswerData[],
) => {
  const data: ExportCsvData[] = [];
  for await (const item of decryptedAnswers) {
    const responseType = item.activityItem?.responseType;
    if (responseType !== ItemResponseType.StabilityTracker || !item.answer) continue;

    const answer = <DecryptedStabilityTrackerAnswer>item.answer;
    const stabilityTrackerValue = (answer as DecryptedStabilityTrackerAnswerObject).phaseType
      ? <DecryptedStabilityTrackerAnswerObject>answer
      : (answer.value as DecryptedStabilityTrackerAnswerObject);
    data.push({
      name: getStabilityTrackerCsvName(item.id, stabilityTrackerValue.phaseType),
      data: await convertJsonToCsv(getStabilityRecords(stabilityTrackerValue.value)),
    });
  }

  return stabilityTrackerItemsData.concat(data);
};

export const getABTrailsItemsData = async (
  abTrackerItemsData: AppletExportData['abTrailsItemsData'],
  decryptedAnswers: DecryptedAnswerData[],
) => {
  const data: ExportCsvData[] = [];
  let index = -1;
  for await (const item of decryptedAnswers) {
    index++;
    const responseType = item.activityItem?.responseType;
    if (responseType !== ItemResponseType.ABTrails || !item.answer) continue;

    const abTrackerValue = (item.answer as DecryptedABTrailsAnswer).value;
    data.push({
      name: getABTrailsCsvName(index, item.id),
      data: await convertJsonToCsv(getABTrailsRecords(abTrackerValue.lines, abTrackerValue.width || 100)),
    });
  }

  return abTrackerItemsData.concat(data);
};

export const getFlankerItemsData = async (
  flankerItemsData: AppletExportData['flankerItemsData'],
  decryptedAnswers: DecryptedAnswerData[],
) => {
  const data: ExportCsvData[] = [];
  let itemIndex = -1;
  for await (const item of decryptedAnswers) {
    itemIndex++;
    const responseType = item.activityItem?.responseType;
    if (responseType !== ItemResponseType.Flanker || !item.answer) continue;

    const flankerValue = (item.answer as AnswerWithWrapper<DecryptedFlankerAnswerItemValue[]>)?.value ?? item.answer;
    data.push({
      name: getFlankerCsvName(item),
      data: await convertJsonToCsv(
        getFlankerRecords({
          responses: flankerValue,
          item: item.activityItem,
          experimentClock: convertDateStampToMs(item.startDatetime),
          itemIndex,
        }),
      ),
    });
  }

  return flankerItemsData.concat(data);
};
