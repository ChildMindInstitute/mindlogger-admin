import { useEffect } from 'react';
import { useFormContext, useWatch, UseFormReturn } from 'react-hook-form';

import { OptionalItemSetupProps, ItemConfigurationForm } from './ItemConfiguration.types';
import { mapSelectionOptionsToResponse, mapSettingsToResponse } from './ItemConfiguration.utils';

export const useOptionalItemSetup = ({
  name,
  defaultValue = '',
  itemType,
}: OptionalItemSetupProps) => {
  const { watch, control, setValue, getValues } = useFormContext();

  useEffect(() => {
    const initialValue = getValues()[name];
    if (initialValue === undefined) {
      setValue(name, defaultValue);
    }

    return () => {
      const itemsInputType = getValues().itemsInputType;
      if (itemsInputType === itemType) return;

      setValue(name, undefined);
    };
  }, [getValues]);

  return { control, watch, setValue };
};

export const useItemConfigurationFormChange = (
  name: string,
  methods: UseFormReturn<ItemConfigurationForm>,
) => {
  const { setValue } = useFormContext();

  const { control } = methods;

  const changes = useWatch({
    control,
    name: ['itemsInputType', 'name', 'body', 'options', 'settings'],
  });

  const updateAppletForm = (fieldName: string, value: unknown) =>
    setValue(`${name}.${fieldName}`, value);

  useEffect(() => {
    const [responseType, name, question, options, settings] = changes;

    updateAppletForm('responseType', responseType);
    updateAppletForm('name', name);
    updateAppletForm('question', question);
    updateAppletForm('responseValues', { options: mapSelectionOptionsToResponse(options) });
    updateAppletForm('config', mapSettingsToResponse(settings));
  }, [changes]);
};
