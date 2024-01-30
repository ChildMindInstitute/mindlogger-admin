import { ReactNode } from 'react';

export type ItemOptionContainerProps = {
  title: string;
  description?: string;
  children: ReactNode;
  'data-testid'?: string;
};
