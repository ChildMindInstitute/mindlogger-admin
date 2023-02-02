import i18n from 'i18n';

export const getDayName = (date: Date) =>
  date.toLocaleDateString(i18n.language, { weekday: 'long' });
