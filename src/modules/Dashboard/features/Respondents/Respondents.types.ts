import { Respondent, RespondentDetail } from 'modules/Dashboard/types';
import { Encryption } from 'shared/utils';
import { MenuActionProps } from 'shared/components';
import { ParticipantTag } from 'shared/consts';

export type RespondentActionProps = {
  respondentId: string | null;
  respondentOrSubjectId: string;
  email: string | null;
};

export type RespondentsActions = {
  scheduleSetupAction: ({ context }: MenuActionProps<RespondentActionProps>) => void;
  userDataExportAction: ({ context }: MenuActionProps<RespondentActionProps>) => void;
  viewDataAction: ({ context }: MenuActionProps<RespondentActionProps>) => void;
  removeAccessAction: ({ context }: MenuActionProps<RespondentActionProps>) => void;
  editRespondent: ({ context }: MenuActionProps<RespondentActionProps>) => void;
  sendInvitation: ({ context }: MenuActionProps<RespondentActionProps>) => void;
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
  subjectTag?: ParticipantTag | null;
};

export enum FilteredAppletsKey {
  Scheduling = 'scheduling',
  Editable = 'editable',
  Viewable = 'viewable',
}

export type FilteredApplets = Record<FilteredAppletsKey, RespondentDetail[]>;

export type FilteredRespondents = {
  [key: string]: FilteredApplets;
};

export type RespondentsData = {
  result: Respondent[];
  count: number;
  orderingFields: string[];
};

export type GetMenuItems = {
  actions: RespondentsActions;
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
