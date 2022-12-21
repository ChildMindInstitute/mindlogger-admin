export type TimePickerProps = {
  value: Date | undefined | null;
  setValue: (value: Date | undefined | null) => void;
  timeIntervals?: number;
  label: string;
};
