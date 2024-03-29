export type DeleteActivityModalProps = {
  activityName: string;
  isOpen: boolean;
  onModalClose: () => void;
  onModalSubmit: () => void;
  'data-testid'?: string;
};
