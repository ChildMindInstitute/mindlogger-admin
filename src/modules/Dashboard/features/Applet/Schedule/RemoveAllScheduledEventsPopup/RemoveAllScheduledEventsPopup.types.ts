export type RemoveAllScheduledEventsPopupProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  activityName: string;
  'data-testid'?: string;
};
