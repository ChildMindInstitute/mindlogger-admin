import { Row } from 'shared/components';

export type ExportSchedulePopupProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  scheduleTableRows: Row[] | undefined;
  respondentName?: string;
};
