import { MutableRefObject } from 'react';

export type ReportHeaderProps = {
  containerRef: MutableRefObject<HTMLElement | null>;
  onButtonClick: () => void;
  activityName: string;
  isButtonDisabled: boolean;
  error: string | null;
  'data-testid'?: string;
};
