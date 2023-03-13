import uniqueId from 'lodash.uniqueid';

import { SliderOption } from './ItemConfiguration.types';
import { DEFAULT_EMPTY_SLIDER } from './ItemConfiguration.const';

export const getEmptySliderOption = (): SliderOption => ({
  id: uniqueId('slider-'),
  ...DEFAULT_EMPTY_SLIDER,
});
