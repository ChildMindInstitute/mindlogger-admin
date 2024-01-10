import { AppletId } from 'shared/api';
import { Item, SingleApplet } from 'shared/state';
import { Roles } from 'shared/consts';
import { RetentionPeriods, EncryptedAnswerSharedProps } from 'shared/types';
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
  language: string;
};

export type AppletInvitationData = AppletId & {
  url: string;
  options: AppletInvitationOptions;
};

export type AppletShellAccountOptions = {
  secretUserId: string;
  firstName: string;
  lastName: string;
  language: string;
  email: string | null;
  nickname?: string;
};

export type AppletShellAccountData = AppletId & {
  options: AppletShellAccountOptions;
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

export type DatavizActivity = {
  id: string;
  name: string;
  isPerformanceTask?: boolean;
  hasAnswer?: boolean;
};

export type SubmitDates = {
  dates: string[];
};

export type ReviewActivity = DatavizActivity & {
  answerDates: {
    answerId: string;
    createdAt: string;
  }[];
};

export type DatavizAnswer = EncryptedAnswerSharedProps & {
  answerId: string;
  endDatetime: string;
  events: string;
  startDatetime: string;
  version: string;
};

export type Answers = AppletId & RespondentId & { createdDate?: string };

export type ActivityAnswer = AppletId & { answerId: string; activityId: string };

export type AssessmentReview = AppletId & { answerId: string };

export type AssessmentResult = {
  answer: string | null;
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

export type Review = {
  answer: string;
  items: Item[];
  itemIds: string[];
  reviewer: {
    firstName: string;
    lastName: string;
  };
  reviewerPublicKey: string;
};

export type SummaryAnswers = AppletId & {
  activityId: string;
  params: {
    respondentId: string;
    fromDatetime: string;
    toDatetime: string;
    emptyIdentifiers: boolean;
    identifiers?: string[];
    versions?: string[];
  };
};

export type Identifier = {
  identifier: string;
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

export type LatestReport = {
  appletId: string;
  activityId: string;
  respondentId: string;
};

export type Identifiers = LatestReport;

export type GetRespondentDetailsParams = OwnerId & AppletId & RespondentId;
