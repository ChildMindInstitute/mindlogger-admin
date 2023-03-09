import { Dispatch, SetStateAction } from 'react';
import { Control } from 'react-hook-form';

import { Workspace } from 'features/SwitchWorkspace/SwitchWorkspace.types';
import { HeadCell } from 'types/table';
import { Row } from 'components';

export type AddToBuilderPopupProps = {
  addToBuilderPopupVisible: boolean;
  setAddToBuilderPopupVisible: Dispatch<SetStateAction<boolean>>;
};

export enum AddToBuilderActions {
  CreateNewApplet = 0,
  AddToExistingApplet = 1,
}

export enum AddToBuilderSteps {
  SelectAccount = 0,
  AddToBuilderActions = 1,
  SelectApplet = 2,
}

export type Step = {
  stepId: AddToBuilderSteps;
  popupTitle: string;
  render: () => JSX.Element;
  buttonText: string;
  hasSecondBtn?: boolean;
  secondBtnText?: string;
  onSecondBtnSubmit?: () => void;
  onSubmitStep: () => void;
};

export type AddToBuilderForm = {
  selectedAccount: string;
  addToBuilderAction: AddToBuilderActions;
  selectedApplet?: string;
};

export type Applet = {
  id: string;
  appletName: string;
  image?: string;
};

export type GetStep = {
  control: Control<AddToBuilderForm>;
  isSelectAccountVisible: boolean;
  accounts: Workspace[];
  applets: Applet[];
  setStep: Dispatch<SetStateAction<AddToBuilderSteps>>;
  setAddToBuilderPopupVisible: Dispatch<SetStateAction<boolean>>;
  handleAddToBuilder: () => void;
  handleContinue: () => void;
};

export type TableController = {
  name: keyof AddToBuilderForm;
  defaultValue?: string;
  control: Control<AddToBuilderForm>;
  columns: HeadCell[];
  rows: Row[] | undefined;
  orderBy: string;
};
