import { FieldValues, useFormContext, UseFormSetValue } from 'react-hook-form';

export function useCustomFormContext() {
  const { setValue: originalSetValue, ...formContext } = useFormContext() || {};

  const setValue: UseFormSetValue<FieldValues> = (name, value, options = {}) => {
    originalSetValue(name, value, { shouldDirty: true, ...options });
  };

  return { ...formContext, setValue };
}
