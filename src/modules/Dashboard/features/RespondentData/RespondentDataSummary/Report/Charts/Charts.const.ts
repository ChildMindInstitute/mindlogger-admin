import { enUS, fr } from 'date-fns/locale';

import { variables } from 'shared/styles';

const { blue, orange, green, brown, yellow, pink, gray, red, purple } = variables.palette;

export const COLORS = [blue, orange, green, brown, yellow, pink, gray, red, purple];
export const TICK_HEIGHT = 36;

export const locales = {
  'en-US': enUS,
  fr,
};

export const TOOLTIP_OFFSET_TOP = 120;
export const TOOLTIP_OFFSET_LEFT = 70;

export const SUBSCALES_CHART_LABEL_WIDTH_Y = 64;
export const LABEL_WIDTH_Y = 180;
export const MAX_LABEL_CHARS_Y = 24;
export const MAX_TICKS_LENGTH = 16;
export const MIN_TICKS_LENGTH = 8;

export const MS_PER_HOUR = 1000 * 60 * 60;
export const MS_PER_DAY = MS_PER_HOUR * 24;
export const POINT_RADIUS_DEFAULT = 6;
export const POINT_RADIUS_SECONDARY = 4;

export const LINK_PATTERN = new RegExp('^(http|https)://', 'i');
