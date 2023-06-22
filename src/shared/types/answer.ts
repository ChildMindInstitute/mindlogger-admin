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

export type DecryptedAnswerSharedProps = {
  userPublicKey: string;
  answer: string;
  itemIds: string[];
  items: Item[];
  events?: string;
};

export type ExportAnswer = {
  id?: string;
  version?: string;
  activityName?: string;
  subscaleSetting?: SubscaleSetting | null;
  respondentId?: string;
  respondentSecretId?: string;
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
};

export type ExtendedExportAnswer = ExportAnswer & DecryptedAnswerSharedProps;

export type DecryptedAnswerData<T> = Omit<T, 'userPublicKey' | 'itemIds' | 'answer' | 'events'> &
  ActivityItemAnswer;

export type DecryptedActivityData<T> = {
  decryptedAnswers: DecryptedAnswerData<T>[];
  decryptedEvents: EventDTO[];
};
