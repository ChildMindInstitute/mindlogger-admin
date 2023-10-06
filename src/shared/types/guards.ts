import { ItemResponseType, ItemsWithFileResponses, ScoreReportType } from 'shared/consts';
import { ScoreOrSection, ScoreReport, SectionReport } from 'shared/state';
import {
  ActivityItemAnswer,
  AudioItemAnswer,
  DecryptedAnswerData,
  DrawingItemAnswer,
  ExtendedExportAnswerWithoutEncryption,
  PhotoItemAnswer,
  VideoItemAnswer,
} from 'shared/types/answer';

export const isScoreReport = (report: ScoreOrSection): report is ScoreReport =>
  report.type === ScoreReportType.Score;
export const isSectionReport = (report: ScoreOrSection): report is SectionReport =>
  report.type === ScoreReportType.Section;

export const isDrawingAnswerData = (
  item: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>,
): item is DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption, DrawingItemAnswer> =>
  item.activityItem?.responseType === ItemResponseType.Drawing && Boolean(item.answer);
export const isNotMediaAnswerData = (
  item: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>,
): item is DecryptedAnswerData<
  ExtendedExportAnswerWithoutEncryption,
  Exclude<ActivityItemAnswer, AudioItemAnswer | PhotoItemAnswer | VideoItemAnswer>
> => !ItemsWithFileResponses.includes(item.activityItem?.responseType);
