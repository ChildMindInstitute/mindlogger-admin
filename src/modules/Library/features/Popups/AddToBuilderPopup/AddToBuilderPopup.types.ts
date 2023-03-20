import { Dispatch, SetStateAction } from 'react';
import { Control } from 'react-hook-form';
import { AnyObjectSchema, SchemaOf } from 'yup';

import { Workspace } from 'shared/features/SwitchWorkspace/SwitchWorkspace.types';
import { HeadCell } from 'shared/types/table';
import { Row } from 'shared/components';

export type AddToBuilderPopupProps = {
  addToBuilderPopupVisible: boolean;
  setAddToBuilderPopupVisible: Dispatch<SetStateAction<boolean>>;
};

export enum AddToBuilderActions {
  CreateNewApplet = 0,
  AddToExistingApplet = 1,
}

export enum AddToBuilderSteps {
  SelectWorkspace = 0,
  AddToBuilderActions = 1,
  SelectApplet = 2,
  Error = 3,
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
  selectedWorkspace: string;
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
  isSelectedWorkspaceVisible: boolean;
  workspaces: Workspace[];
  applets: Applet[];
  setStep: Dispatch<SetStateAction<AddToBuilderSteps>>;
  setAddToBuilderPopupVisible: Dispatch<SetStateAction<boolean>>;
  handleNext: (nextStep?: AddToBuilderSteps) => Promise<void>;
  handleAddToBuilder: () => void;
};

export type TableController = {
  name: keyof AddToBuilderForm;
  defaultValue?: string;
  control: Control<AddToBuilderForm>;
  columns: HeadCell[];
  rows: Row[] | undefined;
  orderBy: string;
};

export type AddToBuilderPopupSchemaType = {
  [AddToBuilderSteps.SelectWorkspace]: SchemaOf<{ selectedWorkspace: string }>;
  [AddToBuilderSteps.AddToBuilderActions]: SchemaOf<{ addToBuilderAction: string }>;
  [AddToBuilderSteps.SelectApplet]: SchemaOf<{ selectedApplet?: string }>;
  [AddToBuilderSteps.Error]: AnyObjectSchema;
};
