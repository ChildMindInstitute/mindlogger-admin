import {
  ActivityItemAnswer,
  EventDTO,
} from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';
import { Item, ScoresAndReports, SubscaleSetting } from 'shared/state';

export type ExportActivity = {
  createdAt: string;
  description: string | Record<string, string>;
  id: string;
  idVersion: string;
  image: string;
  isAssessment: false;
  isHidden?: boolean;
  isReviewable: boolean;
  isSkippable: boolean;
  items: Item[];
  name: string;
  responseIsEditable: boolean;
  scoresAndReports: ScoresAndReports | null;
  showAllAtOnce: boolean;
  splashScreen: string;
  subscaleSetting: SubscaleSetting | null;
  version: string;
};

export type ExportAnswer = {
  id: string;
  version: string;
  userPublicKey: string;
  respondentId: string;
  respondentSecretId: string;
  answer: string;
  itemIds: string[];
  activityHistoryId: string;
  flowHistoryId: null | string;
  flowName: null | string;
  createdAt: string;
  appletId: string;
  activityId: string;
  flowId: null | string;
  reviewedAnswerId: null | string;
  scheduledDatetime?: string;
  startDatetime?: string;
  endDatetime?: string;
  events: string;
};

export type ExtendedExportAnswer = ExportAnswer & {
  items: Item[];
  activityName?: string;
};

export type DecryptedAnswerData = Omit<
  ExtendedExportAnswer,
  'userPublicKey' | 'itemIds' | 'items' | 'answer' | 'events'
> &
  ActivityItemAnswer;

export type DecryptedActivityData = {
  decryptedAnswers: DecryptedAnswerData[];
  decryptedEvents: EventDTO[];
};
