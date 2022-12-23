export enum DateVariant {
  start = 'start',
  end = 'end',
}

export enum MinMaxDate {
  min = 'min',
  max = 'max',
}

export enum UiType {
  oneDate = 'oneDate',
  startEndingDate = 'startEndingDate',
}

export type DatePickerProps = {
  value: string;
  setValue: (value: string) => void;
  uiType?: UiType;
};
