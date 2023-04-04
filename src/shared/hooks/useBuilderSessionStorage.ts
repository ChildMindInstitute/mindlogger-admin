import { FieldValues, UseFormGetValues } from 'react-hook-form';

import { builderSessionStorage } from 'shared/utils';

export const useBuilderSessionStorageFormValues = <T>(defaultValues: T) => {
  const getFormValues = (): T => builderSessionStorage.getItem() ?? defaultValues ?? {};

  return {
    getFormValues,
  };
};

export const useBuilderSessionStorageApplyChanges = () => {
  const applyChanges = (data: Record<string, unknown>) => {
    const layerData = builderSessionStorage.getItem() ?? {};
    builderSessionStorage.setItem({
      ...layerData,
      ...data,
    });
  };

  return {
    applyChanges,
  };
};

export const useBuilderSessionStorageFormChange = <T extends FieldValues>(
  getValues: UseFormGetValues<T>,
) => {
  const { applyChanges } = useBuilderSessionStorageApplyChanges();

  const handleFormChange = () => {
    applyChanges(getValues());
  };

  return {
    handleFormChange,
  };
};
