import { portFieldName } from './LiveResponseStreamingSetting.const';
import { InputChangeProps } from './LiveResponseStreamingSetting.types';

export const getNewValue = ({ value, fieldName }: InputChangeProps) => {
  if (value === '' || value === null) return null;
  if (fieldName === portFieldName && isNaN(+value)) return value;
  if (fieldName === portFieldName) return +value;

  return value;
};
