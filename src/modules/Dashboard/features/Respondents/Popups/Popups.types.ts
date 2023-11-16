import { SingleApplet } from 'shared/state';
import { ChosenAppletData } from 'modules/Dashboard/features/Respondents/Respondents.types';

export type useCheckIfHasEncryptionProps = {
  isAppletSetting?: boolean;
  appletData: ChosenAppletData | SingleApplet | null;
  callback: () => Promise<void> | void;
};
