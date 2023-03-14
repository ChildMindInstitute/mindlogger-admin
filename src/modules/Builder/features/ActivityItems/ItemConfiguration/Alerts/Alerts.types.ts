export type Alert = {
  id?: string;
  option: string;
  item: string;
  message: string;
};

export type AlertProps = {
  removeAlert: (i: number) => void;
  appendAlert: (item: Alert) => void;
  alerts: Alert[];
};
