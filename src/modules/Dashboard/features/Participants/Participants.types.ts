import { Respondent, RespondentDetail } from 'modules/Dashboard/types';
import { MenuActionProps } from 'shared/components';
import { Encryption } from 'shared/utils';

export type ParticipantActionProps = {
  respondentId: string | null;
  respondentOrSubjectId: string;
  email: string | null;
};

export type ParticipantActions = {
  scheduleSetupAction: ({ context }: MenuActionProps<ParticipantActionProps>) => void;
  userDataExportAction: ({ context }: MenuActionProps<ParticipantActionProps>) => void;
  viewDataAction: ({ context }: MenuActionProps<ParticipantActionProps>) => void;
  removeAccessAction: ({ context }: MenuActionProps<ParticipantActionProps>) => void;
  editParticipant: ({ context }: MenuActionProps<ParticipantActionProps>) => void;
  sendInvitation: ({ context }: MenuActionProps<ParticipantActionProps>) => void;
};

export type ChosenAppletData = {
  appletId: string;
  appletDisplayName?: string;
  appletImg?: string;
  respondentSecretId?: string;
  hasIndividualSchedule?: boolean;
  respondentId: string | null;
  respondentNickname?: string | null;
  encryption?: Encryption;
  ownerId: string;
  subjectId: string;
};

export enum FilteredAppletsKey {
  Scheduling = 'scheduling',
  Editable = 'editable',
  Viewable = 'viewable',
}

export type FilteredApplets = Record<FilteredAppletsKey, RespondentDetail[]>;

export type FilteredParticipants = {
  [key: string]: FilteredApplets;
};

export type ParticipantsData = {
  result: Respondent[];
  count: number;
};

export type GetMenuItems = {
  actions: ParticipantActions;
  filteredApplets: FilteredApplets;
  respondentId: string | null;
  respondentOrSubjectId: string;
  email: string | null;
  appletId?: string;
  isInviteEnabled: boolean;
  isViewCalendarEnabled: boolean;
};

export type HandlePinClick = {
  respondentId: string | null;
  subjectId: string;
};

export type SetDataForAppletPage = {
  respondentOrSubjectId: string;
  respondentId?: string | null;
  key: FilteredAppletsKey;
};

export type HandleInviteClick = {
  respondentOrSubjectId: string;
  email: string | null;
};
