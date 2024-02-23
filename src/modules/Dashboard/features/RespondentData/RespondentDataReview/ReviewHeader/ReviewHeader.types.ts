import { MutableRefObject } from 'react';

export type ReviewHeaderProps = {
  containerRef: MutableRefObject<HTMLElement | null>;
  isAnswerSelected: boolean;
  activityName: string;
  onButtonClick: () => void;
  'data-testid': string;
};
