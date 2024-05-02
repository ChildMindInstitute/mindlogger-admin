export type ClearScheduledEventsPopupProps = {
  open: boolean;
  onClose: () => void;
  appletName: string;
  appletId: string;
  name?: string;
  isDefault?: boolean;
  'data-testid'?: string;
  userId?: string;
};

export type Steps = 0 | 1;

export type ScreensParams = {
  appletName: string;
  name?: string;
  isDefault: boolean;
  onSubmit: () => void;
  onClose: () => void;
};
