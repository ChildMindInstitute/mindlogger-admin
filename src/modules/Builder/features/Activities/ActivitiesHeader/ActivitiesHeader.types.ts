import { ReactNode } from 'react';

import { ActivityAddProps } from '../Activities.types';

export type ActivitiesHeaderProps = {
  isSticky?: boolean;
  children: ReactNode;
  headerProps?: {
    onAddActivity?: (props: ActivityAddProps) => void;
  };
};
