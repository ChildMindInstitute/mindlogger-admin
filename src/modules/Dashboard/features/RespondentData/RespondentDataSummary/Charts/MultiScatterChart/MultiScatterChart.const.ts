export const commonConfig = {
  type: 'time' as const,
  time: {
    unit: 'day' as const,
    displayFormats: {
      month: 'dd mmm' as const,
    },
  },
};
