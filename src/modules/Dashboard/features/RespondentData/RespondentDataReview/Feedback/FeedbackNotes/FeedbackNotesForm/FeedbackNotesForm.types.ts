import { MutableRefObject } from 'react';

export type FeedbackNotesFormProps = {
  containerRef: MutableRefObject<HTMLElement | null>;
  onSubmit: () => void;
  isLoading: boolean;
  'data-testid'?: string;
};
