import { FC } from 'react';
import { DefaultTFuncReturn } from 'i18next';

export type SharedToggleItemProps = {
  open?: boolean;
};

export enum ToggleContainerUiType {
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
  isOpenDisabled?: boolean;
  tooltip?: string;
  errorMessage?: string | null;
  hasError?: boolean;
  'data-testid'?: string;
};
