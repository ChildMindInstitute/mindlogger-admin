import { Respondent, RespondentDetail } from 'modules/Dashboard/types';
import { Encryption } from 'shared/utils';

export type RespondentsActions = {
  scheduleSetupAction: (value: string) => void;
  userDataExportAction: (value: string) => void;
  viewDataAction: (value: string) => void;
  removeAccessAction: (value: string) => void;
  editRespondent: (value: string) => void;
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
