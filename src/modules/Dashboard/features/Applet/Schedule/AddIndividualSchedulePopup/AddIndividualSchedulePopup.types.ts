export type AddIndividualSchedulePopupProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  respondentName: string;
  error: string | null;
  isLoading: boolean;
  'data-testid'?: string;
};
