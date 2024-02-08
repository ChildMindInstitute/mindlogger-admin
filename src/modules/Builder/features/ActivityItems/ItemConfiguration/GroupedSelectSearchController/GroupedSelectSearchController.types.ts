import { FieldValues, UseControllerProps } from 'react-hook-form';

import { ItemsOptionGroup } from '../ItemConfiguration.types';

export type FormInputProps = {
  options: ItemsOptionGroup[];
  checkIfSelectChangePopupIsVisible?: (handleOnChange: () => void) => void;
};

export type GroupedSelectControllerProps<T extends FieldValues> = FormInputProps & UseControllerProps<T>;
