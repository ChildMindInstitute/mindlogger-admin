export type RemoveScheduledEventPopupProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  activityName: string;
  isLoading: boolean;
  'data-testid'?: string;
};
