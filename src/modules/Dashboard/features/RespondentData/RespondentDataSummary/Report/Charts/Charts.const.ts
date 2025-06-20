import { enUS, fr } from 'date-fns/locale';

import { variables } from 'shared/styles';

const { blue, orange, green, brown, yellow, pink, gray, red, purple } = variables.palette;

export const COLORS = [blue, orange, green, brown, yellow, pink, gray, red, purple];
export const TICK_HEIGHT = 36;
export const LEGEND_HEIGHT = 120;

export const locales = {
  'en-US': enUS,
  fr,
};

export const SUBSCALES_CHART_LABEL_WIDTH_Y = 64;
export const LABEL_WIDTH_Y = 180;
export const MAX_LABEL_CHARS_Y = 24;
export const MAX_TICKS_COUNT = 15;
export const MIN_TICKS_COUNT = 8;

export const MS_PER_HOUR = 1000 * 60 * 60;
export const MS_PER_DAY = MS_PER_HOUR * 24;
export const POINT_RADIUS_DEFAULT = 6;
export const POINT_RADIUS_SECONDARY = 4;

export const LINK_PATTERN = new RegExp('^(http|https)://', 'i');

export const commonLabelsProps = {
  boxWidth: 24,
  boxHeight: 9,
  padding: 25,
  color: variables.palette.on_surface,
  font: {
    family: 'Moderat',
    size: 14,
  },
  useBorderRadius: true,
  borderRadius: 2,
};
