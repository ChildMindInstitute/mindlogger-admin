import { Dispatch, SetStateAction } from 'react';
import { Control, FieldValues } from 'react-hook-form';

export type ConfigurationPopupProps = {
  open: boolean;
  onClose: () => void;
};

export type ConfigurationForm = {
  hostname: string;
  username: string;
  password: string;
  project?: string;
};

export enum ConfigurationsSteps {
  LorisConfigurations,
  SelectProject,
}

export type GetScreensProps = {
  control: Control<FieldValues>;
  setStep: Dispatch<SetStateAction<ConfigurationsSteps>>;
  onClose: () => void;
  onNext: () => void;
  onSave: () => void;
  projects: string[];
};
