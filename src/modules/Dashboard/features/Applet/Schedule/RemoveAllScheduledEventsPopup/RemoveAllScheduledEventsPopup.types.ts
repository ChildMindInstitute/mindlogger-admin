export type RemoveAllScheduledEventsPopupProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  activityName: string;
  isLoading: boolean;
  'data-testid'?: string;
};
