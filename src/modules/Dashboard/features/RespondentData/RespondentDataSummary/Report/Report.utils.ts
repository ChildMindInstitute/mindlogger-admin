export const getDateTime = (date: Date, time: string) => {
  const [hours, mins] = time.split(':');

  return new Date(new Date((date || new Date()).setHours(+hours)).setMinutes(+mins));
};
