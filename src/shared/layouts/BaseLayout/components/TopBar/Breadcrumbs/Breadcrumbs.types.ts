import { Icons } from 'svgSprite';

export type Breadcrumb = {
  icon?: Icons;
  image?: string;
  useCustomIcon?: boolean;
  label: string;
  chip?: string;
  navPath?: string;
  disabledLink?: boolean;
  hasUrl?: boolean;
  key?: string;
};
