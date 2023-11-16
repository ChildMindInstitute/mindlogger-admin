import { FieldValues, UseControllerProps } from 'react-hook-form';
import { TextFieldProps } from '@mui/material/TextField';

import { SelectEvent } from 'shared/types/event';
import { SxProps } from '@mui/material';

export type Option = {
  value: string | boolean;
  labelKey: string;
  icon?: JSX.Element;
  disabled?: boolean;
  tooltip?: string;
  hidden?: boolean;
  groupKey?: string;
};

export type GetMenuItem = {
  labelKey: string;
  value: string | boolean;
  itemDisabled: boolean;
  icon?: JSX.Element;
  withoutKey?: boolean;
  hidden?: boolean;
};

export enum SelectUiType {
  Primary = 'primary',
  Secondary = 'secondary',
}

type FormSelectProps = {
  options: Option[];
  value?: string;
  customChange?: (e: SelectEvent) => void;
  withChecked?: boolean;
  withGroups?: boolean;
  isLabelNeedTranslation?: boolean;
  uiType?: SelectUiType;
  dropdownStyles?: SxProps;
  'data-testid'?: string;
} & TextFieldProps;

export type SelectControllerProps<T extends FieldValues> = FormSelectProps & UseControllerProps<T>;
