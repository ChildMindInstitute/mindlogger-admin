import { PropsWithChildren } from 'react';

import { Item } from 'shared/state';

export type ButtonsConfig = {
  removeBackButton: boolean;
  skippableItem: boolean;
};

export type ActivityCartProps = {
  step: number;
  isBackVisible: boolean;
  isSubmitVisible: boolean;
  onSubmit: () => void;
  toNextStep?: () => void;
  toPrevStep?: () => void;
};

export type ActivityCardItemListProps = ActivityCartProps &
  PropsWithChildren<{
    items: Item[];
  }>;
