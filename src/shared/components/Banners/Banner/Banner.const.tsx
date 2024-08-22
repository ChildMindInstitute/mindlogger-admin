import { Icons } from 'svgSprite';

import { Svg } from 'shared/components/Svg';

const getSvg = (id: Icons) => <Svg id={id} width={32} height={32} fill="currentColor" />;

export const BANNER_ICONS = {
  info: getSvg('more-info-filled'),
  success: getSvg('check-circle'),
  warning: getSvg('exclamation-circle'),
  error: getSvg('exclamation-octagon'),
};
