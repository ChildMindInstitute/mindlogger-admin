import { Encryption } from 'shared/utils';

export type RespondentsActions = {
  scheduleSetupAction: (value: number) => void;
  userDataExportAction: (value: number) => void;
  viewDataAction: (value: number) => void;
  removeAccessAction: (value: number) => void;
  editRespondent: (value: number) => void;
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
