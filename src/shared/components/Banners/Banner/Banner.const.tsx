import { Svg } from 'shared/components/Svg';

const getSvg = (id: string) => <Svg id={id} width={32} height={32} />;

export const BANNER_ICONS = {
  info: getSvg('more-info-filled'),
  success: getSvg('check-circle'),
  warning: getSvg('exclamation-circle'),
  error: getSvg('exclamation-octagon'),
};
