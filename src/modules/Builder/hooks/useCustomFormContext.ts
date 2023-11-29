import { FieldValues, useFormContext, UseFormSetValue } from 'react-hook-form';

export function useCustomFormContext() {
  const { setValue: originalSetValue, ...formContext } = useFormContext();

  const setValue: UseFormSetValue<FieldValues> = (name, value, options = {}) => {
    originalSetValue(name, value, { ...options, shouldDirty: true });
  };

  return { ...formContext, setValue };
}
