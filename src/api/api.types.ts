export type ServerUrlOption = {
  name: string;
  value: string;
};
export type SignIn = { email: string; password: string };

export type SignInWithToken = { token: string };

export type SignUpArgs = {
  body: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  };
};

export type ResetPassword = { email: string };

export type SwitchAccount = { accountId: string };

export type AppletId = { appletId: string };

export type UserId = { userId: string };

export type FolderId = { folderId: string };

export type UserRoles = 'reviewer' | 'editor' | 'user' | 'coordinator' | 'manager';

export type AccountUserList = Partial<AppletId> & {
  role: UserRoles;
  pagination?: { allow: boolean };
  MRN?: string;
  sort?: { allow: boolean };
};

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

export type SetScheduleData = {
  id: string;
  data: {
    around: number;
    id: string;
    eventsOutside: boolean;
    fill: boolean;
    listTimes: boolean;
    minimumSize: number;
    repeatCovers: boolean;
    size: number;
    type: number;
    updateColumns: boolean;
    updateRows: boolean;
    events?: Event[];
  };
};

export type GetScheduleData = { id: string };

export type TransferOwnership = AppletId & { email: string };

export type SetAccount = { accountName: string };

export type GetActivityByUrl = { url: string };

export type GetUserResponses = AppletId & {
  users: string[];
  fromDate: string;
  toDate: string;
};

export type AddNewApplet = {
  protocolUrl: string;
  email: string;
  data: string;
};

export type RevokeAppletUser = AppletId & {
  profileId: string;
  deleteResponse: boolean;
};

export type UpdateActivityVis = {
  id: string;
  status: boolean;
  activityFlowIds: string[];
  activityIds: string[];
};

export type GetUsersData = AppletId & {
  pageIndex: string;
  options: {
    users: string;
  };
};

export type GetUserList = AppletId & { reviewerId: string };

export type UpdateUserRole = AppletId & UserId & { roleInfo: Record<string, number> };

export type DeleteUserFromRole = { groupId: string; userId: string };

export type CreateApplet = {
  email: string;
  data: string;
  themeId: string;
};

export type GetApplet = {
  retrieveSchedule: boolean;
  allEvent: boolean;
  id: string;
  nextActivity?: boolean;
};

export type UpdateApplet = AppletId & {
  data: string;
  themeId: string;
};

export type PrepareApplet = AppletId & {
  data: string;
  thread: boolean;
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

export type UpdateItemTemplates = { data: string };

export type DuplicateApplet = AppletId & {
  options: {
    name: string;
  };
  data: FormData;
};

export type ReplaceResponseData = AppletId & {
  user: string;
  data: string;
};

export type AppletNameArgs = AppletId & { appletName: string };

export type AppletEncryption = AppletId & { data: string };

export type ProtocolData = AppletId & { versions: string[] };

export type ValidateAppletName = { name: string };

export type UpdateRetainingSettings = AppletId & {
  options: {
    id: string;
    period: string;
    retention: string;
  };
};

export type UpdateProfile = AppletId & {
  options: {
    MRN: string;
    nickName: string;
    userId: string;
  };
};

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

export type PublishApplet = AppletId & { publish: boolean };

export type UpdateAppletSearchTerms = AppletId & { params: { keywords: string } };

export type Notes = AppletId & { responseId: string };

export type AddNote = Notes & { note: string };

export type DownloadGcpFile = AppletId & { bucket: string; key: string; isAzure: boolean };

export type UpdateNote = AppletId & { noteId: string; note: string };

export type DeleteNote = AppletId & { noteId: string };

export type PostAppletPublicLink = AppletId & { requireLogin: boolean };

export type DownloadReviews = AppletId & { responseId: string };

export type ResponseData = {
  activity: {
    id: string;
    schema: string;
    schemaVersion: string;
  };
  applet: {
    id: string;
    schemaVersion: string;
  };
  subject: string;
  responseStarted: string;
  responseCompleted: number;
  client: {
    appId: string;
  };
  languageCode: string;
  reviewing: {
    responseId: string;
  };
};

export type PostReviewerResponse = {
  response: ResponseData & {
    responses: Record<string, number>;
    dataSource: {
      text: string;
      key: string;
    };
    userPublicKey: string;
  };
};

export type SetPdfPassword = {
  url: string;
  token: string;
  password: string;
  serverAppletId: string;
  accountId: string;
  appletId: string;
};

export type SetWelcomeStatus = AppletId & { status: boolean };
