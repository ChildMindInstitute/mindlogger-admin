import { AppletId } from 'shared/api';

export type GetUserData = { token: string };

export type GetAppletsParams = {
  params: {
    ownerId: string;
    search?: string;
    page?: number;
    limit?: number;
    ordering?: string;
    roles?: string;
  };
};

export type SwitchAccount = { accountId: string };

export type UserId = { userId: string };

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
  };
};

export type SetAccount = { accountName: string };

export type RevokeAppletUser = AppletId & {
  profileId: string;
  deleteResponse: boolean;
};

export type GetUsersData = AppletId & {
  pageIndex?: string;
  users?: string;
};

export type AppletInvitationData = AppletId & {
  options: {
    role: string;
    firstName: string;
    lastName: string;
    nickName: string;
    email: string;
    MRN: string;
    accountName: string;
    users: string[];
  };
};

export type DuplicateApplet = AppletId & {
  options: {
    name: string;
  };
  data: FormData;
};

export type AppletNameArgs = AppletId & { appletName: string };

export type AppletEncryption = AppletId & { data: FormData };

export type ValidateAppletName = { name: string };

export type UpdatePin = {
  profileId: string;
  newState: boolean;
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
