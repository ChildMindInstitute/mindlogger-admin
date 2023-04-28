const MINUTES_TO_MILLISECONDS_MULTIPLIER = 60 * 1000;

export const getDateInUserTimezone = (dateString: string) => {
  const date = new Date(dateString);
  const userDateOffsetMinutes = new Date().getTimezoneOffset();

  return new Date(date.getTime() - userDateOffsetMinutes * MINUTES_TO_MILLISECONDS_MULTIPLIER);
};
