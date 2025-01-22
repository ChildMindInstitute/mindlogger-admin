import { Row, SubmitBtnColor } from 'shared/components';
import { ChosenAppletData } from 'modules/Dashboard/features/Respondents/Respondents.types';

export type RemoveRespondentPopupProps = {
  popupVisible: boolean;
  tableRows: Row[] | undefined;
  chosenAppletData: ChosenAppletData | null;
  onClose: () => void;
};

export type GetScreen = (respondentName: string, appletName: string) => JSX.Element;

export type Steps = 0 | 1 | 2 | 3 | 4;

export type ScreensParams = {
  firstScreen: JSX.Element;
  secondScreen: JSX.Element;
  thirdExtScreen: JSX.Element;
  respondentName: string;
  appletName: string;
  removeData: boolean;
  isRemoved: boolean;
  submitPassword: () => void;
  removeAccess: () => void;
  onClose: () => void;
};

export type Screen = {
  component: JSX.Element;
  buttonText: string;
  hasSecondBtn: boolean;
  title: string;
  submitForm?: () => void;
  onClose?: () => void;
  submitBtnColor?: SubmitBtnColor;
};
