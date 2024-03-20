import { MutableRefObject } from 'react';

export type StickyHeaderProps = {
  containerRef: MutableRefObject<HTMLElement | null>;
  'data-testid'?: string;
};
