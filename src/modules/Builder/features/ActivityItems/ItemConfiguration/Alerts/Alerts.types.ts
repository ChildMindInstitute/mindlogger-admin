export type AlertProps = {
  name: string;
  removeAlert: (i: number) => void;
  appendAlert: () => void;
  alerts: Record<'id', string>[];
};
