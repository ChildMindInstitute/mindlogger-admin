import { Icons } from 'svgSprite';

export type ActivityListItemCounterProps = {
  icon: Icons;
  label: string;
  count?: number;
  isLoading: boolean;
};
