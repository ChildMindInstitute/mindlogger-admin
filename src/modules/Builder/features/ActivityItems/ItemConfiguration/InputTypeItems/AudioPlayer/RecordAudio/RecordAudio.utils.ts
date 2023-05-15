export const formatSecondsToMinutes = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secondsWithoutMinutes = seconds % 60;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${secondsWithoutMinutes}` : secondsWithoutMinutes;

  return `${formattedMinutes}:${formattedSeconds}`;
};
