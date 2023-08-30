import { MutableRefObject } from 'react';

import { ItemResponseTypeNoPerfTasks } from 'modules/Builder/types';

import { OptionalItemsRef } from '../OptionalItemsAndSettings';

export type ConfigurationHeaderProps = {
  containerRef: MutableRefObject<HTMLElement | null>;
  responseType: ItemResponseTypeNoPerfTasks;
  optionalItemsRef: MutableRefObject<OptionalItemsRef | null>;
  onClose: () => void;
};
