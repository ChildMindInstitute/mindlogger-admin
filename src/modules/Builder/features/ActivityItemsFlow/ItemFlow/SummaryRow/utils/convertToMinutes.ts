export const convertToMinutes = (timeString: string | null) => {
  if (!timeString) return null;

  const [hours, minutes] = timeString.split(':').map(Number);

  return hours * 60 + minutes;
};
