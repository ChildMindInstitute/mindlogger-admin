export type RemoveScheduledEventPopupProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  activityName: string;
  'data-testid'?: string;
};
