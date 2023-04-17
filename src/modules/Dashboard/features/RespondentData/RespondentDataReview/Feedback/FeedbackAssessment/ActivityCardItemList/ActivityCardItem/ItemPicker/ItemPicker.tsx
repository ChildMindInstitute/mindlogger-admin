import { MultiSelectItem, SingleSelectItem, SliderItem } from 'shared/state';

import { SingleSelection } from './SingleSelection';
import { MultipleSelection } from './MultipleSelection';
import { Slider } from './Slider';
import { ItemPickerProps } from './ItemPicker.types';

export const ItemPicker = ({ item, step, isDisabled }: ItemPickerProps) => {
  switch (item.responseType) {
    case 'singleSelect':
      return (
        <SingleSelection item={item as SingleSelectItem} step={step} isDisabled={isDisabled} />
      );
    case 'multiSelect':
      return (
        <MultipleSelection item={item as MultiSelectItem} step={step} isDisabled={isDisabled} />
      );
    case 'slider':
      return <Slider item={item as SliderItem} step={step} isDisabled={isDisabled} />;
    default:
      return <></>;
  }
};
