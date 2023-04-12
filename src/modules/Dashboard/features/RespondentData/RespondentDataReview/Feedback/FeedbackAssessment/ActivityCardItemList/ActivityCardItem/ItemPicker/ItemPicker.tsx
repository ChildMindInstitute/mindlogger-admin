import { SingleSelection } from './SingleSelection';
import { MultipleSelection } from './MultipleSelection';
import { Slider } from './Slider';
import { ItemPickerProps } from './ItemPicker.types';

export const ItemPicker = ({ item, step, isDisabled }: ItemPickerProps) => {
  switch (item.responseType) {
    case 'singleSelect':
      return <SingleSelection item={item} step={step} isDisabled={isDisabled} />;
    case 'multiSelect':
      return <MultipleSelection item={item} step={step} isDisabled={isDisabled} />;
    case 'slider':
      return <Slider item={item} step={step} isDisabled={isDisabled} />;
    default:
      return <></>;
  }
};
