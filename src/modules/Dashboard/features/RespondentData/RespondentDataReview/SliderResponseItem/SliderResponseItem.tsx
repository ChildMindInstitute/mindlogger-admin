import { StyledSlider } from './SliderResponseItem.styles';
import { SliderResponseItemProps } from './SliderResponseItem.types';

export const SliderResponseItem = ({ item, response }: SliderResponseItemProps) => (
  <StyledSlider
    min={item.responseValues.minValue}
    max={item.responseValues.maxValue}
    value={Number(response.value)}
    disabled
  />
);
