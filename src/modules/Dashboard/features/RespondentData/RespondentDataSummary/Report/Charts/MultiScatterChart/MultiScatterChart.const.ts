export const commonConfig = {
  type: 'time' as const,
  time: {
    unit: 'day' as const,
    displayFormats: {
      month: 'dd mmm' as const,
    },
  },
};

export const LABEL_WIDTH_Y = 180;
export const MAX_LABEL_CHARS_Y = 24;
