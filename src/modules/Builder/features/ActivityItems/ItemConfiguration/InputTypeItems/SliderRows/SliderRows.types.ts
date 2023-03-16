import { ReactNode } from 'react';
import { FieldValues, UseControllerProps } from 'react-hook-form';

import { SliderOption } from '../../ItemConfiguration.types';

export type SliderProps<T extends FieldValues> = {
  isMultiple?: boolean;
} & UseControllerProps<T>;

export type SliderMapper = (sliderOption: SliderOption, index: number) => ReactNode;
