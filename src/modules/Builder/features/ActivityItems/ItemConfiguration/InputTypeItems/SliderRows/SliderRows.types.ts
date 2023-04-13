import { ReactNode } from 'react';

import { SliderOption } from '../../ItemConfiguration.types';

export type SliderProps = {
  name: string;
  isMultiple?: boolean;
};

export type SliderMapper = (sliderOption: SliderOption, index: number) => ReactNode;
