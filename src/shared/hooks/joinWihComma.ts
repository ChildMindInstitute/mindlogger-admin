export const joinWihComma = (array: string[]) =>
  `${array?.map((item) => item.charAt(0).toUpperCase() + item.slice(1)).join(', ')}`;
