import { StyledSlider } from './SliderResponseItem.styles';
import { DEFAULT_SLIDER_MIN_NUMBER } from './SliderResponseItem.const';
import { ResponseItemProps } from '../Review.types';

export const SliderResponseItem = ({ item, response }: ResponseItemProps) => (
  <StyledSlider
    min={DEFAULT_SLIDER_MIN_NUMBER}
    max={item.responseOptions?.length}
    value={Number(response.value)}
    disabled
    marks={item.responseOptions?.map(({ value, label }) => ({ value, label }))}
  />
);
