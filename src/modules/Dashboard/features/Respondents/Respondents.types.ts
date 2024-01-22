import { Respondent, RespondentDetail } from 'modules/Dashboard/types';
import { Encryption } from 'shared/utils';
import { MenuActionProps } from 'shared/components';

export type RespondentActionProps = { respondentId: string; email: string | null };

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
  respondentId: string;
  respondentNickname?: string | null;
  encryption?: Encryption;
  ownerId: string;
};

export type FilteredApplets = {
  scheduling: RespondentDetail[];
  editable: RespondentDetail[];
  viewable: RespondentDetail[];
};

export type FilteredRespondents = {
  [key: string]: FilteredApplets;
};

export type RespondentsData = {
  result: Respondent[];
  count: number;
};

export type GetMenuItems = {
  actions: RespondentsActions;
  filteredApplets: FilteredApplets;
  isAnonymousRespondent: boolean;
  respondentId: string;
  email: string | null;
  appletId?: string;
  isInviteEnabled: boolean;
};
