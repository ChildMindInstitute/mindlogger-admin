const baseDate = new Date('1900-01-01');

export const convertDateToNumber = (date: Date | null) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return null;
  }

  const baseTime = baseDate.getTime();
  const dateTime = date.getTime();

  const differenceInDays = Math.round((dateTime - baseTime) / (1000 * 60 * 60 * 24));

  return differenceInDays + 1;
};
