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
import { ItemResponseType } from 'shared/consts';
import {
  getABTrailsCsvName,
  getFlankerCsvName,
  getMediaFileName,
  getStabilityTrackerCsvName,
} from 'shared/utils/exportData/getReportName';
import { convertJsonToCsv } from 'shared/utils/exportTemplate';
import { getDrawingLines } from 'shared/utils/exportData/getDrawingLines';
import { getStabilityRecords } from 'shared/utils/exportData/getStabilityRecords';
import { getABTrailsRecords } from 'shared/utils/exportData/getABTrailsRecords';
import { getFlankerRecords } from 'shared/utils/exportData/getFlankerRecords';
import { convertDateStampToMs } from 'shared/utils/exportData/convertDateStampToMs';

export const getDrawingItemsData = (
  drawingItemsData: AppletExportData['drawingItemsData'],
  decryptedAnswers: DecryptedAnswerData[],
) => {
  const drawingAnswers = decryptedAnswers.reduce((acc, item) => {
    const responseType = item.activityItem?.responseType;
    if (responseType !== ItemResponseType.Drawing || !item.answer) return acc;
    const drawingValue = (item.answer as DecryptedDrawingAnswer).value;

    return acc.concat({
      name: getMediaFileName(item, 'csv'),
      data: convertJsonToCsv(getDrawingLines(drawingValue.lines, drawingValue.width || 100)),
    });
  }, [] as ExportCsvData[]);

  return drawingItemsData.concat(...drawingAnswers);
};

export const getStabilityTrackerItemsData = (
  stabilityTrackerItemsData: AppletExportData['stabilityTrackerItemsData'],
  decryptedAnswers: DecryptedAnswerData[],
) => {
  const stabilityTrackerAnswers = decryptedAnswers.reduce((acc, item) => {
    const responseType = item.activityItem?.responseType;
    if (responseType !== ItemResponseType.StabilityTracker || !item.answer) return acc;

    const answer = <DecryptedStabilityTrackerAnswer>item.answer;
    const stabilityTrackerValue = (answer as DecryptedStabilityTrackerAnswerObject).phaseType
      ? <DecryptedStabilityTrackerAnswerObject>answer
      : (answer.value as DecryptedStabilityTrackerAnswerObject);

    return acc.concat({
      name: getStabilityTrackerCsvName(item.id, stabilityTrackerValue.phaseType),
      data: convertJsonToCsv(getStabilityRecords(stabilityTrackerValue.value)),
    });
  }, [] as ExportCsvData[]);

  return stabilityTrackerItemsData.concat(...stabilityTrackerAnswers);
};

export const getABTrailsItemsData = (
  abTrackerItemsData: AppletExportData['abTrailsItemsData'],
  decryptedAnswers: DecryptedAnswerData[],
) => {
  const abTrackerAnswers = decryptedAnswers.reduce((acc, item, index) => {
    const responseType = item.activityItem?.responseType;
    if (responseType !== ItemResponseType.ABTrails || !item.answer) return acc;

    const abTrackerValue = (item.answer as DecryptedABTrailsAnswer).value;

    return acc.concat({
      name: getABTrailsCsvName(index, item.id),
      data: convertJsonToCsv(getABTrailsRecords(abTrackerValue.lines, abTrackerValue.width || 100)),
    });
  }, [] as ExportCsvData[]);

  return abTrackerItemsData.concat(...abTrackerAnswers);
};

export const getFlankerItemsData = (
  flankerItemsData: AppletExportData['flankerItemsData'],
  decryptedAnswers: DecryptedAnswerData[],
) => {
  const flankerAnswers = decryptedAnswers.reduce((acc, item, itemIndex) => {
    const responseType = item.activityItem?.responseType;
    if (responseType !== ItemResponseType.Flanker || !item.answer) return acc;

    const flankerValue =
      (item.answer as AnswerWithWrapper<DecryptedFlankerAnswerItemValue[]>)?.value ?? item.answer;

    return acc.concat({
      name: getFlankerCsvName(item),
      data: convertJsonToCsv(
        getFlankerRecords({
          responses: flankerValue,
          item: item.activityItem,
          experimentClock: convertDateStampToMs(item.startDatetime),
          itemIndex,
        }),
      ),
    });
  }, [] as ExportCsvData[]);

  return flankerItemsData.concat(...flankerAnswers);
};
