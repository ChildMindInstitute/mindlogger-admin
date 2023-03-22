import { FC } from 'react';

export type SharedToggleItemProps = {
  open?: boolean;
};
export type ToggleItemProps = {
  title: string;
  HeaderContent: FC<SharedToggleItemProps>;
  Content: FC<SharedToggleItemProps>;
};
