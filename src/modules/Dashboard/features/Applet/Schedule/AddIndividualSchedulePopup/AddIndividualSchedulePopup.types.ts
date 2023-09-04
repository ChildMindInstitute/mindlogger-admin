export type AddIndividualSchedulePopupProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  respondentName: string;
  error: string | null;
  'data-testid'?: string;
};
