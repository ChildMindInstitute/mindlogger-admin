import { FieldValues, UseControllerProps } from 'react-hook-form';

import { ItemsOptionGroup } from '../ItemConfiguration.types';

export type FormInputProps = {
  options: ItemsOptionGroup[];
};

export type GroupedSelectControllerProps<T extends FieldValues> = FormInputProps &
  UseControllerProps<T>;
