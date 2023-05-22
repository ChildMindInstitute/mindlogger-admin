export const TOOLTIP_OFFSET_TOP = 60;
export const TOOLTIP_OFFSET_LEFT = 70;

export const commonConfig = {
  type: 'time' as const,
  time: {
    unit: 'day' as const,
    displayFormats: {
      month: 'dd mmm' as const,
    },
  },
};
