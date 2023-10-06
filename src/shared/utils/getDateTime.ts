const HOURS_MINUTES_REGEXP = /^(?:[01]\d|2[0-3]):[0-5]\d$/; //HH:mm format

export const getDateTime = (date: Date, time: string) => {
  if (!HOURS_MINUTES_REGEXP.test(time)) {
    return date;
  }
  const [hours, minutes] = time.split(':');

  return new Date(new Date((date || new Date()).setHours(+hours)).setMinutes(+minutes));
};
