import { ChosenAppletData } from 'modules/Dashboard/features/Respondents/Respondents.types';

export type useCheckIfHasEncryptionProps = {
  appletData: ChosenAppletData | null;
  callback: () => Promise<void> | void;
};
