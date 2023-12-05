export const formatSecondsToMinutes = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secondsWithoutMinutes = seconds % 60;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = secondsWithoutMinutes.toString().padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
};
