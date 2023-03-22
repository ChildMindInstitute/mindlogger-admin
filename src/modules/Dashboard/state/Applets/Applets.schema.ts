import { BaseSchema } from 'shared/state/Base';

export type Applet = {
  id: string;
  displayName: string;
  version: string;
  description: string;
  about: string;
  image: string;
  watermark: string;
  themeId: string;
  reportServerIp: string;
  reportPublicKey: string;
  reportRecipients: string[];
  reportIncludeUserId: boolean;
  reportIncludeCaseId: boolean;
  reportEmailBody: string;
  createdAt: string;
  updatedAt: string;
};

export type Event = {
  startTime: string;
  endTime: string;
  accessBeforeSchedule: boolean;
  oneTimeCompletion: boolean;
  timer: string;
  // TODO: change when prev PR was merged
  timerType: 'NOT_SET';
  id: string;
  periodicity: {
    type: 'ONCE';
    startDate: string;
    endDate: string;
    selectedDate: string;
  };
  respondentId: string;
  activityId: string;
  flowId: string;
};

export type AppletsSchema = {
  applets: BaseSchema<{ result: Applet[]; count: number } | null>;
  events: BaseSchema<{ result: Event[]; count: number } | null>;
};
