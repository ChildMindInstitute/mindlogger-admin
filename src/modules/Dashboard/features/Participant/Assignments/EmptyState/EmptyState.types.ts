import { Icons } from 'svgSprite';

export type EmptyStateProps = {
  icon: Icons;
  title: string;
  onClickAssign?: () => void;
  /** @default '50.7rem' */
  maxWidth?: string;
  dataTestId: string;
};
