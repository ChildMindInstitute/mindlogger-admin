const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
export const convertToMinutes = (timeString: string | null) => {
  if (!timeString || !timeRegex.test(timeString)) return null;

  const [hours, minutes] = timeString.split(':').map(Number);

  return hours * 60 + minutes;
};
