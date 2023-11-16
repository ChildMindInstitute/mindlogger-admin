import { BYTE_QUANTITY } from 'shared/types/fileSystem';

type FORMATTER = (value?: string | number) => string;

export const byteFormatter: FORMATTER = (cellValue) => {
  if (!cellValue && cellValue !== 0) return '';

  let output = cellValue;
  [BYTE_QUANTITY.b, BYTE_QUANTITY.kb, BYTE_QUANTITY.mb, BYTE_QUANTITY.gb, BYTE_QUANTITY.tb].some(
    (quantity, i, arr) => {
      if (Number(output) >= 1024 ** (i + 1) && i < arr.length - 1) {
        return false;
      }

      let resultValue = Number(cellValue) / 1024 ** i;
      resultValue = resultValue % 1 ? Number(resultValue.toFixed(2)) : resultValue;
      output = `${resultValue} ${quantity}`;

      return true;
    },
  );

  return String(output);
};
