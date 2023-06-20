import { capitalize } from './capitalize';

export const joinWihComma = (array: string[]) =>
  `${array?.map((item) => capitalize(String(item))).join(', ')}`;
