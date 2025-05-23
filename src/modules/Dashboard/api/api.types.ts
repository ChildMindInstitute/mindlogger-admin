import { User } from 'modules/Auth/state';
import { ActivityId, AppletId } from 'shared/api';
import { ParticipantTag, PerfTaskType, Roles } from 'shared/consts';
import { Activity, ActivityFlow, Item, SingleApplet, SubscaleSetting } from 'shared/state';
import { EncryptedAnswerSharedProps, ExportActivity, RetentionPeriods } from 'shared/types';
import { Encryption } from 'shared/utils';

import {
  Manager,
  ParticipantWithDataAccess,
  SubjectDetails,
  SubjectDetailsWithDataAccess,
} from '../types';

export type GetAppletsParams = {
  params: {
    ownerId?: string;
    search?: string;
    page?: number;
    limit?: number;
    ordering?: string;
    roles?: string;
    appletId?: string;
    shell?: boolean;
  };
};

export type GetWorkspaceManagersParams = GetAppletsParams;

export type WorkspaceManagersResponse = {
  result: Manager[];
  count: number;
  orderingFields?: string[];
};

export type GetWorkspaceRespondentsParams = GetAppletsParams & {
  params: {
    userId?: string;
    includeSoftDeletedSubjects?: boolean;
  };
};

export type WorkspaceRespondentsResponse = {
  result: ParticipantWithDataAccess[];
  count: number;
  orderingFields?: string[];
};

export type GetActivitiesParams = {
  params: {
    appletId: string;
    hasScore?: boolean;
    hasSubmitted?: boolean;
  };
};

export type GetSubjectActivitiesParams = AppletId & SubjectId;

export type AppletActivitiesResponse = {
  result: {
    activitiesDetails: Activity[];
    appletDetail: Applet;
  };
};

export type HydratedAssignment = {
  id: string;
  activityId: string | null;
  activityFlowId: string | null;
  respondentSubject: SubjectDetails;
  targetSubject: SubjectDetails;
};

export type AssignedActivity = Activity & { assignments?: HydratedAssignment[] };
export type AssignedActivityFlow = ActivityFlow & { assignments?: HydratedAssignment[] };

export type AppletSubjectActivitiesResponse = {
  result: {
    activities: AssignedActivity[];
    activityFlows: AssignedActivityFlow[];
  };
};

type ParticipantActivity = {
  isFlow: false;
  activityIds: null;
};

type ParticipantFlow = {
  isFlow: true;
  activityIds: string[];
};

export enum ActivityAssignmentStatus {
  Active = 'active',
  Inactive = 'inactive',
  Hidden = 'hidden',
  Deleted = 'deleted',
}

export type ParticipantActivityOrFlow = (ParticipantActivity | ParticipantFlow) & {
  id: string;
  name: string;
  description: string;
  images: string[];
  isPerformanceTask: boolean | null;
  performanceTaskType: PerfTaskType | null;
  status: ActivityAssignmentStatus;
  autoAssign: boolean;
  assignments: HydratedAssignment[];
};

export type AppletParticipantActivitiesResponse = {
  result: ParticipantActivityOrFlow[];
  count: number;
};

export type ParticipantActivityOrFlowMetadata = {
  activityOrFlowId: string;
  /** # of participants who have responded about the participant or are assigned as respondent */
  respondentsCount: number;
  /** # of submissions made with participant as the respondent */
  respondentSubmissionsCount: number;
  /** Date of most recent submission with participant as the respondent */
  respondentLastSubmissionDate: string | null;
  /** # of participants who the participant has responded about or are assigned as target subject */
  subjectsCount: number;
  /** # of submissions made with participant as the target subject */
  subjectSubmissionsCount: number;
  /** Date of most recent submission with participant as the target subject */
  subjectLastSubmissionDate: string | null;
};

export type AppletParticipantActivitiesMetadataResponse = {
  result: SubjectId & {
    respondentActivitiesCountExisting: number;
    respondentActivitiesCountDeleted: number;
    targetActivitiesCountExisting: number;
    targetActivitiesCountDeleted: number;
    activitiesOrFlows: ParticipantActivityOrFlowMetadata[];
  };
};

export type RespondentId = { respondentId: string };

export type TargetSubjectId = { targetSubjectId: string };

export type SubjectId = { subjectId: string };

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
  accesses: { appletId: string; roles: Roles[]; subjects: string[] }[];
};

export type EditSubject = SubjectId & {
  values: {
    secretUserId: string;
    nickname?: string;
    tag?: ParticipantTag;
  };
};

export type EditSubjectResponse = {
  id: string;
  lastSeen: string | null;
  appletId: string;
  userId: string | null;
  secretUserId: string;
  nickname: string | null;
  tag: ParticipantTag | null;
  firstName: string | null;
  lastName: string | null;
  title?: string | null;
  role?: Roles | null;
};

export type DeleteSubject = SubjectId & {
  deleteAnswers: boolean;
};

export type AppletInvitationOptions = {
  email: string;
  firstName: string;
  language: string;
  lastName: string;
  nickname?: string;
  role: string;
  secretUserId?: string;
  subjects?: string[];
  tag?: string;
  title?: string;
  workspacePrefix?: string;
};

export type AppletInvitationData = AppletId & {
  url: 'respondent' | 'reviewer' | 'managers';
  options: AppletInvitationOptions;
};

export type SubjectInvitationData = AppletId &
  SubjectId & {
    email: string;
    language?: string;
  };

export type AppletShellAccountOptions = {
  email: string | null;
  firstName: string;
  language: string;
  lastName: string;
  nickname?: string;
  secretUserId: string;
  tag?: string;
};

export type AppletShellAccountData = AppletId & {
  options: AppletShellAccountOptions;
};

export type DuplicateApplet = AppletId & {
  options: {
    encryption: Encryption;
    displayName: string;
    includeReportServer?: boolean;
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

export type ReviewEntity = Omit<DatavizEntity, 'hasAnswer' | 'isPerformanceTask'> & {
  answerDates: AnswerDate[];
};

export type ReviewCount = {
  mine: number;
  other: number;
};

export type EncryptedActivityAnswers = EncryptedAnswerSharedProps & {
  answerId: string;
  endDatetime: string;
  events: string;
  startDatetime?: string;
  subscaleSetting: SubscaleSetting;
  version: string;
  reviewCount?: ReviewCount;
};

export type SubmitId = { submitId: string };

export type Answers = AppletId & TargetSubjectId & { createdDate?: string };

export type ActivityAnswerParams = AppletId & { answerId: string; activityId: string };

export interface GetActivityParams {
  activityId: string;
}

export interface GetActivityResponse {
  result: Activity;
}
export interface GetAppletSubmissionsParams extends AppletId {
  page?: number;
  limit?: number;
}
export interface GetAppletSubmissionsResponse {
  participantsCount?: number;
  submissions: {
    activityId: string;
    activityName: string;
    appletId: string;
    createdAt: string;
    sourceNickname?: string | null;
    sourceSubjectId: string;
    sourceSecretUserId: string;
    sourceSubjectTag?: ParticipantTag | null;
    targetNickname?: string | null;
    targetSubjectId: string;
    targetSecretUserId: string;
    targetSubjectTag?: ParticipantTag | null;
    updatedAt: string;
  }[];
  submissionsCount?: number;
}

export type FlowAnswersParams = AppletId & FlowId & SubmitId;

export type AssessmentReview = AppletId & { answerId: string };

export type AssessmentFlowReviewParams = AppletId & SubmitId;

export type AssessmentId = { assessmentId: string };

export type DeleteReview = AssessmentReview & AssessmentId;

export type DeleteFlowReviewParams = AppletId & AssessmentId & SubmitId;

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

export type SaveFlowAssessmentParams = AppletId &
  SubmitId & {
    answer: string;
    itemIds: string[];
    reviewerPublicKey: string;
    assessmentVersionId: string;
  };

export type Review = {
  id: string;
  createdAt: string;
  updatedAt: string;
  items: Item[];
  itemIds: string[];
  reviewer: Omit<User, 'email'>;
  /* "null" returns in case the user does not have access to the answer
  (a user with the role of reviewer only has access to their own review answers) */
  answer: string | null;
  reviewerPublicKey: string | null;
};

export type GetAnswersParams = {
  params: TargetSubjectId & {
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

export type GetNotesParams = {
  params: {
    search?: string;
    page?: number;
    limit?: number;
    ordering?: string;
  };
};

export type AppletSubmitDateList = AppletId &
  TargetSubjectId & {
    fromDate: string;
    toDate: string;
    activityOrFlowId: string;
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
  targetSubjectIds?: string;
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
};

export type ScheduleHistoryParams = AppletId & {
  respondentIds?: string[];
  subjectIds?: string[];
  activityOrFlowIds?: string[];
  page?: number;
  limit?: number;
};

export type ScheduleHistoryData = {
  appletId: string;
  appletVersion: string;
  appletName: string;
  userId: string | null;
  subjectId: string | null;
  eventId: string;
  eventType: 'activity' | 'flow';
  eventVersion: string;
  eventVersionCreatedAt: string;
  eventVersionUpdatedAt: string;
  eventVersionIsDeleted: boolean;
  linkedWithAppletAt: string;
  eventUpdatedBy: string;
  activityOrFlowId: string;
  activityOrFlowName: string;
  activityOrFlowHidden: boolean;
  accessBeforeSchedule: boolean | null;
  oneTimeCompletion: boolean | null;
  periodicity: Periodicity;
  startDate: string | null;
  startTime: string;
  endDate: string | null;
  endTime: string;
  selectedDate: string | null;
};

export type DeviceScheduleHistoryData = {
  userId: string;
  deviceId: string;
  eventId: string;
  eventVersion: string;
  startDate: string | null;
  startTime: string;
  endDate: string | null;
  endTime: string;
  accessBeforeSchedule: boolean | null;
  createdAt: string;
  userTimeZone: string | null;
};

export type FlowItemHistoryParams = AppletId & {
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  flowIds?: string[];
};

export type FlowItemHistoryData = {
  appletId: string;
  appletVersion: string;
  appletName: string;
  flowId: string;
  flowName: string;
  activityId: string;
  activityName: string;
  createdAt: string;
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

export type GetLatestReportParams = AppletId & SubjectId & { activityId?: string; flowId?: string };

export type GetActivityIdentifiersParams = Omit<GetLatestReportParams, 'subjectId'> &
  TargetSubjectId;

export type GetFlowIdentifiersParams = AppletId & TargetSubjectId & FlowId;

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
  sourceSubject: SubjectDetails;
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
  reviewCount?: ReviewCount;
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

export type FeedbackNote = {
  id: string;
  user: Omit<User, 'email'>;
  note: string;
  createdAt: string;
};

export type CreateTemporaryMultiInformantRelation = {
  subjectId: string;
  sourceSubjectId: string;
};

export type GetAssignmentsParams = AppletId & {
  flows?: string;
  activities?: string;
};

export type PostAssignmentsParams = AppletId & {
  assignments: Assignment[];
};

export type Assignment = {
  id?: string;
  activityId: string | null;
  activityFlowId: string | null;
  respondentSubjectId: string;
  targetSubjectId: string;
};

export type AppletAssignmentsResponse = {
  result: {
    appletId: string;
    assignments: Assignment[];
  };
};

export type GetTargetSubjectsByRespondentParams = SubjectId & {
  activityOrFlowId: string;
};

export type TargetSubjectsByRespondent = Array<
  SubjectDetailsWithDataAccess &
    AppletId & {
      submissionCount: number;
      currentlyAssigned: boolean;
    }
>;

export type GetTargetSubjectsByRespondentResponse = {
  result: TargetSubjectsByRespondent;
  count: number;
};

export type Integration = {
  integrationType: string;
};
