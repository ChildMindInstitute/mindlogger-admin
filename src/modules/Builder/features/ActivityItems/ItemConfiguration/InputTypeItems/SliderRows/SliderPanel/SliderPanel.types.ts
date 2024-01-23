import { ItemAlert, SliderItemResponseValues } from 'shared/state';

export type SliderPanelProps = {
  name: string;
  label: string;
  index?: number;
  isMultiple?: boolean;
  onRemove?: () => void;
};

export enum SliderInputType {
  MinValue,
  MaxValue,
}

export type SetScoresAndAlertsChange = {
  minValue: number;
  maxValue: number;
  type: SliderInputType;
  scores: SliderItemResponseValues['scores'];
  alerts: ItemAlert[];
  setValue: (fieldName: string, value: number[] | number) => void;
  scoresName: string;
  hasAlerts: boolean;
  alertsName: string;
};

export type GetStrictValue = {
  value: string | number;
  minValue: number;
  maxValue: number;
};
