export type DateVariant = 'start' | 'end';

export type MinMaxDate = 'min' | 'max';

export enum UiType {
  oneDate = 'oneDate',
  startEndingDate = 'startEndingDate',
}

export type DatePickerProps = {
  value: string;
  setValue: (value: string) => void;
  uiType?: UiType;
};
