import { FC } from 'react';

export enum CollapseTypes {
  Default = 'default',
  Switch = 'switch',
}

export type SharedCollapseProps = {
  open?: boolean;
};

export type CollapseProps = {
  defaultOpen?: boolean;
  timeout?: number;
  collapsedSize?: string;
  uiType?: CollapseTypes;
  HeaderContent?: FC<SharedCollapseProps>;
  Content?: FC<SharedCollapseProps>;
};
