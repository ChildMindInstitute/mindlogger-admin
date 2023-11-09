export type ConfirmScheduledAccessPopupProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  activityName: string;
};
