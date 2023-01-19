import { Dispatch, SetStateAction } from 'react';
import { AxiosResponse } from 'axios';

import { Row } from 'components';
import { ChosenAppletData } from 'features/Respondents/Respondents.types';

export type RemoveAccessPopupProps = {
  popupVisible: boolean;
  setPopupVisible: Dispatch<SetStateAction<boolean>>;
  tableRows: Row[] | undefined;
  chosenAppletData: ChosenAppletData | null;
  setChosenAppletData: Dispatch<SetStateAction<ChosenAppletData | null>>;
};

export type Steps = 0 | 1 | 2 | 3 | 4;

export type ScreensParams = {
  firstScreen: JSX.Element;
  secondScreen: JSX.Element;
  thirdExtScreen: JSX.Element;
  respondentName: string;
  appletName: string;
  removeData: boolean;
  isRemoved: AxiosResponse | null;
  submitPassword: () => void;
  removeAccess: () => void;
  handlePopupClose: () => void;
};
