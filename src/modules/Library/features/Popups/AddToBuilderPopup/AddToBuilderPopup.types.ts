import { Dispatch, SetStateAction } from 'react';

import { Control } from 'react-hook-form';
import { AnyObjectSchema, ObjectSchema } from 'yup';

import { Row } from 'shared/components';
import { WorkspaceWithRoles } from 'shared/state';
import { HeadCell } from 'shared/types/table';

export type AddToBuilderPopupProps = {
  addToBuilderPopupVisible: boolean;
  setAddToBuilderPopupVisible: Dispatch<SetStateAction<boolean>>;
};

export enum AddToBuilderActions {
  CreateNewApplet = 'create',
  AddToExistingApplet = 'add',
}

export enum AddToBuilderSteps {
  LoadingWorkspaces,
  SelectWorkspace,
  AddToBuilderActions,
  SelectApplet,
  Error,
  AccessError,
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
  isWorkspacesModalVisible: boolean;
  hasAppletAccessError: boolean;
  workspaces: WorkspaceWithRoles[];
  applets: Applet[];
  setStep: Dispatch<SetStateAction<AddToBuilderSteps>>;
  setAddToBuilderPopupVisible: Dispatch<SetStateAction<boolean>>;
  handleNext: (nextStep?: AddToBuilderSteps) => Promise<void>;
  handleAddToNewApplet: () => void;
  handleAddToExistingApplet: () => void;
  errorCallback: () => void;
};

export type TableController = {
  name: keyof AddToBuilderForm;
  defaultValue?: string;
  control: Control<AddToBuilderForm>;
  columns: HeadCell[];
  rows: Row[] | undefined;
  orderBy: string;
  dataTestid?: string;
};

export type AddToBuilderPopupSchemaType = {
  [AddToBuilderSteps.LoadingWorkspaces]: AnyObjectSchema;
  [AddToBuilderSteps.SelectWorkspace]: ObjectSchema<{ selectedWorkspace: string }>;
  [AddToBuilderSteps.AddToBuilderActions]: ObjectSchema<{ addToBuilderAction: string }>;
  [AddToBuilderSteps.SelectApplet]: ObjectSchema<{ selectedApplet?: string }>;
  [AddToBuilderSteps.Error]: AnyObjectSchema;
  [AddToBuilderSteps.AccessError]: AnyObjectSchema;
};
