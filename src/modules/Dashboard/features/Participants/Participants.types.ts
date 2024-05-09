import { Respondent, RespondentDetail, RespondentStatus } from 'modules/Dashboard/types';
import { MenuActionProps } from 'shared/components';
import { ParticipantTag } from 'shared/consts';
import { Encryption } from 'shared/utils';

export type ParticipantActionProps = {
  respondentId: string | null;
  respondentOrSubjectId: string;
  email: string | null;
  secretId: string | null;
  nickname?: string | null;
  tag?: ParticipantTag | null;
};

export type ParticipantActions = {
  editParticipant: ({ context }: MenuActionProps<ParticipantActionProps>) => void;
  upgradeAccount: ({ context }: MenuActionProps<ParticipantActionProps>) => void;
  exportData: ({ context }: MenuActionProps<ParticipantActionProps>) => void;
  removeParticipant: ({ context }: MenuActionProps<ParticipantActionProps>) => void;
  assignActivity: ({ context }: MenuActionProps<ParticipantActionProps>) => void;
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

export type GetParticipantActionsProps = {
  actions: ParticipantActions;
  filteredApplets: FilteredApplets;
  respondentId: string | null;
  respondentOrSubjectId: string;
  email: string | null;
  secretId: string | null;
  nickname?: string | null;
  tag?: ParticipantTag | null;
  appletId?: string;
  status: RespondentStatus;
  dataTestid: string;
  showAssignActivity?: boolean;
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

export type HandleUpgradeAccount = {
  respondentOrSubjectId: string;
  secretId: string | null;
  nickname?: string | null;
  tag?: ParticipantTag | null;
};
