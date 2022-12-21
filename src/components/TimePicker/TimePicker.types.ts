export type TimePickerProps = {
  value: Date | undefined | null;
  setValue: (date: Date) => void;
  timeIntervals?: number;
  label: string;
};
