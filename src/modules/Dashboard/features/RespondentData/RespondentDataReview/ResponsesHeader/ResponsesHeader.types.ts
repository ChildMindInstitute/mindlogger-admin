import { MutableRefObject } from 'react';

export type ResponsesHeaderProps = {
  containerRef: MutableRefObject<HTMLElement | null>;
  isAnswerSelected: boolean;
  name: string;
  onButtonClick: () => void;
  'data-testid': string;
};
