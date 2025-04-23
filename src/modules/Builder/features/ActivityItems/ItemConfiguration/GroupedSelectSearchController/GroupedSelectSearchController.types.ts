import { FieldValues, UseControllerProps, UseFormSetValue } from 'react-hook-form';

import { ItemResponseType } from 'shared/consts';

import { ItemsOptionGroup } from '../ItemConfiguration.types';

export type FormInputProps = {
  options: ItemsOptionGroup[];
  checkIfSelectChangePopupIsVisible?: (handleOnChange: () => void) => void;
  fieldName: string;
  setValue: UseFormSetValue<FieldValues>;
  onBeforeChange?: (newValue: ItemResponseType) => boolean;
};

export type GroupedSelectControllerProps<T extends FieldValues> = FormInputProps &
  UseControllerProps<T>;
