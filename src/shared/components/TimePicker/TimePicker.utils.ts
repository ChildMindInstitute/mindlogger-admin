export const cleanInput = (input: string): string => input.replace(/[^\d]/g, '');

export const validateInput = (defaultTime: string, input: string): string => {
  const hours = input.substring(0, 2);
  const minutes = input.substring(2, 4);

  if (parseInt(hours, 10) > 23 || parseInt(minutes, 10) > 59) {
    return defaultTime.replace(':', '');
  }

  return hours + minutes;
};

export const formatInput = (input: string): string => {
  const hours = input.substring(0, 2);
  const minutes = input.substring(2, 4) || '00';

  return `${hours}:${minutes}`;
};
