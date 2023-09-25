import { MutableRefObject, ReactNode } from 'react';

import { ItemResponseTypeNoPerfTasks } from 'modules/Builder/types';

import { OptionalItemsRef } from '../OptionalItemsAndSettings/OptionalItemsAndSettings.types';

export type ConfigurationHeaderProps = {
  isSticky?: boolean;
  children: ReactNode;
  headerProps?: {
    responseType?: ItemResponseTypeNoPerfTasks;
    optionalItemsRef?: MutableRefObject<OptionalItemsRef | null>;
    onClose?: () => void;
  };
};
