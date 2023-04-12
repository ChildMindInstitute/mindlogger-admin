import { PropsWithChildren } from 'react';

export type ActivityItemType = 'singleSelect' | 'multiSelect' | 'slider';

export type RadioValues = {
  options: Array<{
    id: string;
    text: string;
    image: string | null;
    tooltip: string | null;
  }>;
};

export type CheckboxValues = {
  options: Array<{
    id: string;
    text: string;
    image: string | null;
    tooltip: string | null;
  }>;
};

export type SliderValues = {
  minLabel: string | null;
  maxLabel: string | null;
  minValue: number;
  maxValue: number;
  minImage: string | null;
  maxImage: string | null;
};

export type ButtonsConfig = {
  removeBackButton: boolean;
  skippableItem: boolean;
};

export type RadioItemConfig = ButtonsConfig;

export type CheckboxItemConfig = ButtonsConfig;

export type SliderItemConfig = ButtonsConfig & {
  continuousSlider: boolean;
};

export type Config = RadioItemConfig | CheckboxItemConfig | SliderItemConfig;

export type ResponseValues = RadioValues | CheckboxValues | SliderValues;

export type ActivityItemBase = {
  id: string;
  question: string;
  responseType: ActivityItemType;
  answer: string[];
};

export type SingleSelectionType = ActivityItemBase & {
  responseType: 'singleSelect';
  config: RadioItemConfig;
  responseValues: RadioValues;
};

export type MultipleSelectionType = ActivityItemBase & {
  responseType: 'multiSelect';
  config: CheckboxItemConfig;
  responseValues: CheckboxValues;
};

export type SliderType = ActivityItemBase & {
  responseType: 'slider';
  config: SliderItemConfig;
  responseValues: SliderValues;
};

export type ActivityItem = SingleSelectionType | MultipleSelectionType | SliderType;

export type ActivityCardItemListProps = PropsWithChildren<{
  step: number;
  items: ActivityItem[];
  isBackVisible: boolean;
  isSubmitVisible: boolean;
  onSubmit: () => void;
  toNextStep?: () => void;
  toPrevStep?: () => void;
}>;
