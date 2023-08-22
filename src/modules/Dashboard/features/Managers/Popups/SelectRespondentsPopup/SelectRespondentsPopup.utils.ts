import { FieldValues } from 'react-hook-form';

export const getSelectedRespondentsLength = (formValues: FieldValues) =>
  Object.values(formValues).filter(Boolean)?.length;
