import { ChosenAppletData } from 'modules/Dashboard/features/Respondents/Respondents.types';
import { SingleApplet } from 'shared/state';

export type useCheckIfHasEncryptionProps = {
  isAppletSetting?: boolean;
  appletData: ChosenAppletData | SingleApplet | null;
  callback: () => Promise<void> | void;
};
