import { AppletId } from 'shared/api';
import { Encryption } from 'shared/utils';

export type GetUserData = { token: string };

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

export type SwitchAccount = { accountId: string };

export type RespondentId = { respondentId: string };

export type FolderId = { folderId: string };

export type UserRoles = 'reviewer' | 'editor' | 'user' | 'coordinator' | 'manager';

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

export const enum TimerType {
  NotSet = 'NOT_SET',
  Timer = 'TIMER',
  Idle = 'IDLE',
}

export const enum Periodicity {
  Once = 'ONCE',
  Daily = 'DAILY',
  Weekly = 'WEEKLY',
  Weekdays = 'WEEKDAYS',
  Monthly = 'MONTHLY',
  Always = 'ALWAYS',
}

export const enum NotificationType {
  Fixed = 'FIXED',
  Random = 'RANDOM',
}

export type EventNotifications =
  | {
      atTime?: string | null;
      fromTime?: string | null;
      toTime?: string | null;
      triggerType: NotificationType;
    }[]
  | null;

export type EventReminder = { activityIncomplete: number; reminderTime: string | null } | null;

export type CreateEventType = AppletId & {
  body: {
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
      reminder: EventReminder;
    } | null;
  };
};

export type SetAccount = { accountName: string };

type RemoveAccess = {
  userId: string;
  appletIds: string[];
};

export type RemoveManagerAccess = RemoveAccess & {
  role: UserRoles;
};

export type RemoveRespondentAccess = RemoveAccess & {
  deleteResponses: boolean;
};

export type GetUsersData = AppletId & {
  pageIndex?: string;
  users?: string;
};

export type AppletInvitationData = AppletId & {
  url: string;
  options: {
    role: string;
    firstName: string;
    lastName: string;
    nickname: string;
    email: string;
    secretUserId: string;
    workspacePrefix: string;
    respondents: string[];
  };
};

export type DuplicateApplet = AppletId & {
  options: {
    encryption: Encryption;
    displayName: string;
  };
};

export type AppletNameArgs = AppletId & { appletName: string };

export type AppletEncryption = AppletId & { encryption: Encryption };

export type UpdatePin = {
  accessId: string;
  ownerId?: string;
};

export type Folder = {
  folder: {
    name: string;
    parentId: string;
  };
};

export type UpdateFolder = Folder & { folderId: string };

export type TogglePin = { applet: { parentId: string; id: string }; isPinned: boolean };

export type UpdateAlertStatus = { alertId: string };

export type PublishApplet = AppletId & { publish?: boolean };

export type UpdateAppletSearchTerms = AppletId & { params: { keywords: string } };

export type PostAppletPublicLink = AppletId & { requireLogin: boolean };

export type OwnerId = {
  ownerId: string;
};

export type Answers = { id: string; createdDate: string } & RespondentId;

export type Answer = AppletId & { answerId: string };

export type AppletUniqueName = {
  name: string;
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

export type RespondentAccesses = OwnerId &
  RespondentId & {
    search?: string;
    page?: number;
    limit?: number;
    ordering?: string;
  };

export type AppletDataRetention = AppletId & {
  period: number;
  retention: 'indefinitely' | 'days' | 'weeks' | 'months' | 'years';
};
