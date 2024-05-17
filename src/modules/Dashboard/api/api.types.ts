import { ActivityId, AppletId } from 'shared/api';
import { Item, SingleApplet, SubscaleSetting } from 'shared/state';
import { Roles } from 'shared/consts';
import { RetentionPeriods, EncryptedAnswerSharedProps, ExportActivity } from 'shared/types';
import { Encryption } from 'shared/utils';

export type GetAppletsParams = {
  params: {
    ownerId?: string;
    search?: string;
    page?: number;
    limit?: number;
    ordering?: string;
    roles?: string;
    appletId?: string;
  };
};

export type RespondentId = { respondentId: string };

export type FolderId = { folderId: string };

export type FlowId = { flowId: string };

export type Event = {
  data: {
    URI: string;
    activity_id: string;
    availability: boolean;
    busy: boolean;
    calendar: string;
    color: string;
    completion: boolean;
    description: string;
    eventType: string;
    extendedTime: {
      allow: boolean;
      minute: number;
    };
    forecolor: string;
    icon: string;
    idleTime: {
      allow: boolean;
      minute: number;
    };
    isActivityFlow: boolean;
    location: string;
    notifications: {
      allow: boolean;
      end: string;
      random: boolean;
      start: string;
    }[];
    onlyScheduledDay: boolean;
    reminder: {
      days: number;
      time: string;
      valid: boolean;
    };
    timedActivity: {
      allow: boolean;
      hour: number;
      minute: number;
      second: number;
    };
    timeout: {
      access: boolean;
      allow: boolean;
      day: number;
      hour: number;
      minute: number;
    };
    title: string;
    useNotifications: boolean;
    users: string[];
  };
  schedule: {
    dayOfMonth: string[];
    month: string[];
    year: string[];
  };
};

export type TransferOwnershipType = AppletId & { email: string };

export enum TimerType {
  NotSet = 'NOT_SET',
  Timer = 'TIMER',
  Idle = 'IDLE',
}

export enum Periodicity {
  Once = 'ONCE',
  Daily = 'DAILY',
  Weekly = 'WEEKLY',
  Weekdays = 'WEEKDAYS',
  Monthly = 'MONTHLY',
  Always = 'ALWAYS',
}

export enum NotificationType {
  Fixed = 'FIXED',
  Random = 'RANDOM',
}

export const enum DashboardAppletType {
  Applet = 'applet',
  Folder = 'folder',
}

export type EventNotifications =
  | {
      atTime?: string | null;
      fromTime?: string | null;
      toTime?: string | null;
      triggerType: NotificationType;
    }[]
  | null;

export type EventReminder = { activityIncomplete: number; reminderTime: string | null };

type CreateEvent = {
  startTime?: string;
  endTime?: string;
  accessBeforeSchedule?: boolean;
  oneTimeCompletion?: boolean;
  timer?: string;
  timerType?: TimerType;
  periodicity?: {
    type: Periodicity;
    startDate?: string;
    endDate?: string;
    selectedDate?: string;
  };
  respondentId?: string;
  activityId?: string;
  flowId?: string;
  notification: {
    notifications: EventNotifications;
    reminder: EventReminder | null;
  } | null;
};

export type CreateEventType = AppletId & {
  body: CreateEvent;
};

export type ImportSchedule = AppletId & {
  body: CreateEvent[];
};

export type RemoveAccess = {
  userId: string;
  appletIds: string[];
};

export type EditManagerAccess = {
  userId: string;
  ownerId: string;
  accesses: { appletId: string; roles: Roles[]; respondents: string[] }[];
};

export type RemoveRespondentAccess = RemoveAccess & {
  deleteResponses: boolean;
};

export type EditRespondent = {
  ownerId: string;
  respondentId: string;
  appletId: string;
  values: {
    secretUserId: string;
    nickname?: string;
  };
};

export type AppletInvitationOptions = {
  role: string;
  firstName: string;
  lastName: string;
  nickname: string;
  email: string;
  secretUserId: string;
  workspacePrefix: string;
  respondents: string[];
};

export type AppletInvitationData = AppletId & {
  url: string;
  options: AppletInvitationOptions;
};

export type DuplicateApplet = AppletId & {
  options: {
    encryption: Encryption;
    displayName: string;
  };
};

export type AppletName = { appletName: string };

export type AppletEncryption = AppletId & { encryption: Encryption };

export type UpdatePin = {
  userId: string;
  ownerId?: string;
};

export type FolderName = { name: string };

export type UpdateFolder = OwnerId & FolderName & FolderId;

export type TogglePin = OwnerId & {
  appletId: string;
  folderId: string;
  isPinned: boolean;
};

export type PublishApplet = AppletId & AppletName & { keywords: string[] };

export type UpdateAppletSearchTerms = AppletId & { params: { keywords: string } };

export type PostAppletPublicLink = AppletId & { requireLogin: boolean };

export type OwnerId = {
  ownerId: string;
};

export type DatavizEntity = {
  id: string;
  name: string;
  hasAnswer: boolean;
  lastAnswerDate: string | null;
  isPerformanceTask?: boolean;
};

export type SubmitDates = {
  dates: string[];
};

export type AnswerDate = {
  answerId?: string;
  submitId?: string;
  createdAt: string;
  endDatetime?: string;
};

export type ReviewActivity = Omit<DatavizEntity, 'hasAnswer' | 'isPerformanceTask'> & {
  answerDates: AnswerDate[];
};

export type ReviewFlow = {
  id: string;
  name: string;
  lastAnswerDate: string | null;
  answerDates: AnswerDate[];
};

export type EncryptedActivityAnswers = EncryptedAnswerSharedProps & {
  answerId: string;
  endDatetime: string;
  events: string;
  startDatetime?: string;
  subscaleSetting: SubscaleSetting;
  version: string;
};

export type Answers = AppletId & RespondentId & { createdDate?: string };

export type ActivityAnswerParams = AppletId & { answerId: string; activityId: string };

export type FlowAnswersParams = AppletId & FlowId & { submitId: string };

export type AssessmentReview = AppletId & { answerId: string };

export type AssessmentId = { assessmentId: string };

export type DeleteReview = AssessmentReview & AssessmentId;

export type AssessmentResult = {
  answer: string | null;
  id: string;
  itemIds: string[];
  items: Item[];
  itemsLast: Item[] | null;
  reviewerPublicKey: string | null;
  versions: string[];
};

export type SaveAssessment = AppletId & {
  answerId: string;
} & {
  answer: string;
  itemIds: string[];
  reviewerPublicKey: string;
  assessmentVersionId: string;
};

export type Reviewer = {
  firstName: string;
  lastName: string;
  id: string;
};

export type Review = {
  id: string;
  createdAt: string;
  updatedAt: string;
  items: Item[];
  itemIds: string[];
  reviewer: Reviewer;
  /* "null" returns in case the user does not have access to the answer
  (a user with the role of reviewer only has access to their own review answers) */
  answer: string | null;
  reviewerPublicKey: string | null;
};

export type GetAnswersParams = {
  params: {
    respondentId: string;
    fromDatetime: string;
    toDatetime: string;
    emptyIdentifiers: boolean;
    identifiers?: string[];
    versions?: string[];
  };
};

export type SummaryActivityAnswersParams = AppletId & ActivityId & GetAnswersParams;

export type SummaryFlowAnswersParams = AppletId & FlowId & GetAnswersParams;

export type Identifier = {
  identifier: string;
  lastAnswerDate: string;
  userPublicKey: string | null;
};

export type NoteId = { noteId: string };

export type Note = { note: string };

export type GetAnswersNotesParams = {
  params: {
    search?: string;
    page?: number;
    limit?: number;
    ordering?: string;
  };
};

export type AppletSubmitDateList = AppletId &
  RespondentId & {
    fromDate: string;
    toDate: string;
  };

export type EventId = { eventId: string };

export type AppletDataRetention = AppletId & {
  period: number | undefined;
  retention: RetentionPeriods;
};

export type GetWorkspaceAppletsParams = {
  params: {
    ownerId?: string;
    search?: string;
    page?: number;
    limit?: number;
    ordering?: string;
    roles?: string;
    folderId?: string | null;
    flatList?: boolean;
  };
};

export type ReportConfig = {
  reportServerIp: string;
  reportPublicKey: string;
  reportRecipients: string[];
  reportIncludeUserId: boolean;
  reportIncludedActivityName?: string;
  reportIncludedItemName?: string;
  reportEmailBody: string;
};

export type AppletVersionChanges = AppletId & { version: string };

export type ExportData = AppletId & {
  respondentIds?: string;
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
};

export type Folder = {
  id: string;
  name?: string;
  displayName: string;
  isFolder?: boolean;
  isNew?: boolean;
  isRenaming?: boolean;
  foldersAppletCount: number;
};

export type Applet = SingleApplet & {
  id: string;
  isFolder?: boolean;
  parentId?: string;
  type?: DashboardAppletType;
  folderId?: string;
  folderName?: string;
  isPinned?: boolean;
};

export type Version = {
  version: string;
  createdAt: string;
};

export type GetLatestReportParams = AppletId & ActivityId & RespondentId;

export type GetActivityIdentifiersParams = GetLatestReportParams;

export type GetFlowIdentifiersParams = AppletId & RespondentId & FlowId;

export type GetActivityVersionsParams = AppletId & ActivityId;

export type GetFlowVersionsParams = AppletId & FlowId;

export type GetRespondentDetailsParams = OwnerId & AppletId & RespondentId;

export type AnswerSummary = {
  createdAt: string;
  endDatetime: string | null;
  version: string;
  identifier: Identifier | null;
};

export type ActivityAnswer = {
  id: string;
  submitId: string;
  activityHistoryId: string;
  activityId: string | null;
  flowHistoryId: string | null;
  identifier: string | null;
  createdAt: string;
  endDatetime: string;
};

export type ActivityHistoryFull = Omit<ExportActivity, 'isPerformanceTask' | 'subscaleSetting'> & {
  appletId: string;
  order: number;
  subscaleSetting: SubscaleSetting;
};

export type EncryptedActivityAnswer = {
  activity: ActivityHistoryFull;
  answer: Omit<EncryptedAnswerSharedProps, 'items'> &
    ActivityAnswer &
    Omit<AnswerSummary, 'identifier'> & {
      identifier: string | null;
    };
  summary: AnswerSummary;
};

export type FlowHistory = {
  name: string;
  description: string | Record<string, string>;
  isSingleReport: boolean | null;
  hideBadge: boolean | null;
  reportIncludedActivityName: string | null;
  reportIncludedItemName: string | null;
  id: string;
  idVersion: string;
  order: number;
  createdAt: string;
  activities: ActivityHistoryFull[];
};

export type FlowSubmission = {
  submitId: string;
  flowHistoryId: string;
  appletId: string;
  isCompleted: boolean | null;
  answers: (Omit<EncryptedAnswerSharedProps, 'items'> &
    ActivityAnswer &
    Omit<AnswerSummary, 'identifier'> & {
      identifier: string | null;
    })[];
  endDatetime: string | null;
} & Omit<AnswerSummary, 'identifier'>;

export type EncryptedFlowsAnswers = {
  flows: FlowHistory[];
  submissions: FlowSubmission[];
};

export type EncryptedFlowAnswers = {
  flow: FlowHistory;
  submission: FlowSubmission;
  summary: AnswerSummary;
};
