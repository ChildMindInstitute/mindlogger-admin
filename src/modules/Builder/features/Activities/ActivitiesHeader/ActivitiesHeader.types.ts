import { ReactNode } from 'react';

export type ActivitiesHeaderProps = {
  isSticky?: boolean;
  children: ReactNode;
  headerProps?: { onAddActivity?: () => void };
};
