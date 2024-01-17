import { Respondent, RespondentDetail } from 'modules/Dashboard/types';
import { Encryption } from 'shared/utils';
import { MenuActionProps } from 'shared/components';

export type RespondentsActions = {
  scheduleSetupAction: ({ context }: MenuActionProps<string>) => void;
  userDataExportAction: ({ context }: MenuActionProps<string>) => void;
  viewDataAction: ({ context }: MenuActionProps<string>) => void;
  removeAccessAction: ({ context }: MenuActionProps<string>) => void;
  editRespondent: ({ context }: MenuActionProps<string>) => void;
};

export type ChosenAppletData = {
  appletId: string;
  appletDisplayName?: string;
  appletImg?: string;
  respondentSecretId?: string;
  hasIndividualSchedule?: boolean;
  respondentId: string;
  respondentNickname?: string;
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
  appletId?: string;
  isInviteEnabled: boolean;
};
