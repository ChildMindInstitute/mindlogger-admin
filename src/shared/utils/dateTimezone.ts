export const MINUTES_TO_MILLISECONDS_MULTIPLIER = 60 * 1000;

export const getNormalizeTimezoneData = (dateString: string) => {
  const dateTime = new Date(dateString).getTime();
  const userDateOffsetMilliseconds = new Date().getTimezoneOffset() * MINUTES_TO_MILLISECONDS_MULTIPLIER;

  return {
    dateTime,
    userDateOffsetMilliseconds,
  };
};

export const getDateInUserTimezone = (dateString: string) => {
  const { dateTime, userDateOffsetMilliseconds } = getNormalizeTimezoneData(dateString);

  return new Date(dateTime - userDateOffsetMilliseconds);
};

export const getNormalizedTimezoneDate = (dateString: string) => {
  const { dateTime, userDateOffsetMilliseconds } = getNormalizeTimezoneData(dateString);

  return new Date(dateTime + userDateOffsetMilliseconds);
};
