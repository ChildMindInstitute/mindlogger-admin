import { Dispatch, SetStateAction } from 'react';
import { FieldValues, UseControllerProps } from 'react-hook-form';
import { TextFieldProps } from '@mui/material/TextField';
import { SxProps } from '@mui/material';

import { SelectEvent } from 'shared/types/event';

export type Option = {
  value: string | boolean;
  labelKey: string;
  icon?: JSX.Element;
  disabled?: boolean;
  tooltip?: string | JSX.Element;
  hidden?: boolean;
  groupKey?: string;
  tooltipPlacement?: 'bottom' | 'right';
};

export type GetMenuItem = {
  labelKey: string;
  value: string | boolean;
  itemDisabled: boolean;
  icon?: JSX.Element;
  hidden?: boolean;
  tooltip?: string | JSX.Element;
  tooltipPlacement?: 'bottom' | 'right';
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
  isErrorVisible?: boolean;
  targetSelector?: string;
  setTrigger?: Dispatch<SetStateAction<boolean>>;
  'data-testid'?: string;
  shouldSkipIcon?: boolean;
} & TextFieldProps;

export type SelectControllerProps<T extends FieldValues> = FormSelectProps & UseControllerProps<T>;

export type SelectObserverTargetProps = Pick<
  SelectControllerProps<FieldValues>,
  'setTrigger' | 'targetSelector'
>;

export type StyledMenuItemProps = {
  uiType: SelectUiType;
  itemDisabled?: boolean;
  component?: React.ElementType;
};
