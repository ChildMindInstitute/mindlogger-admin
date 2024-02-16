import { FC } from 'react';

export type SharedToggleItemProps = {
  open?: boolean;
};

export enum ToggleContainerUiType {
  PerformanceTask,
  Score,
}

export type ToggleItemProps = {
  title?: string | JSX.Element;
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
  headerToggling?: boolean;
  'data-testid'?: string;
};
