import { capitalize } from './capitalize';

export const joinWihComma = (array: string[], notCapitalizeItems?: boolean) => {
  if (!array) return '';

  return array
    .reduce((acc: string[], item) => {
      const stringItem = notCapitalizeItems ? String(item) : capitalize(String(item));
      if (stringItem) {
        acc.push(stringItem);
      }

      return acc;
    }, [])
    .join(', ');
};
