import { Dispatch, SetStateAction } from 'react';
import { Control } from 'react-hook-form';
import { AnyObjectSchema, SchemaOf } from 'yup';

import { HeadCell } from 'shared/types/table';
import { Row } from 'shared/components';
import { WorkspaceWithRoles } from 'shared/state';

export type AddToBuilderPopupProps = {
  addToBuilderPopupVisible: boolean;
  setAddToBuilderPopupVisible: Dispatch<SetStateAction<boolean>>;
};

export enum AddToBuilderActions {
  CreateNewApplet = 'create',
  AddToExistingApplet = 'add',
}

export enum AddToBuilderSteps {
  SelectWorkspace,
  AddToBuilderActions,
  SelectApplet,
  Error,
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
  workspaces: WorkspaceWithRoles[];
  applets: Applet[];
  setStep: Dispatch<SetStateAction<AddToBuilderSteps>>;
  setAddToBuilderPopupVisible: Dispatch<SetStateAction<boolean>>;
  handleNext: (nextStep?: AddToBuilderSteps) => Promise<void>;
  handleAddToBuilder: () => void;
  handleAddToExistingApplet: () => void;
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
