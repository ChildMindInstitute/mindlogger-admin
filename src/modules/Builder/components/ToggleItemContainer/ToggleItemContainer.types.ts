import { FC } from 'react';
import { DefaultTFuncReturn } from 'i18next';

export type SharedToggleItemProps = {
  open?: boolean;
};

export enum ToggleContainerUiType {
  Item,
  PerformanceTask,
  Score,
}

export type ToggleItemProps = {
  title?: string | JSX.Element | DefaultTFuncReturn;
  HeaderContent?: FC<SharedToggleItemProps & any>;
  Content: FC<SharedToggleItemProps & any>;
  headerContentProps?: Record<string, unknown>;
  contentProps?: Record<string, unknown>;
  uiType?: ToggleContainerUiType;
  isOpenByDefault?: boolean;
  tooltip?: string;
  error?: string | null;
};
