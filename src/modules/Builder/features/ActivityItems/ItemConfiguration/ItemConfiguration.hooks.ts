import { useEffect } from 'react';
import { useFormContext, useWatch, UseFormReturn } from 'react-hook-form';
import { ItemResponseType } from 'shared/consts';

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
  const { setValue, getValues } = useFormContext();

  const { control } = methods;

  const [responseType, itemName, question, settings] = useWatch({
    control,
    name: ['itemsInputType', 'name', 'body', 'settings'],
  });

  const [options] = useWatch({
    control,
    name: ['options'],
  });

  const [maxResponseLength, correctAnswer] = useWatch({
    control,
    name: ['textResponseMaxCharacters', 'textResponseAnswer'],
  });

  const updateAppletForm = (fieldName: string, value: unknown) =>
    setValue(`${name}.${fieldName}`, value);

  useEffect(() => {
    updateAppletForm('responseType', responseType);
    updateAppletForm('name', itemName);
    updateAppletForm('question', question);
    updateAppletForm('config', mapSettingsToResponse(responseType, settings));
  }, [responseType, itemName, question, settings]);

  useEffect(() => {
    if (
      responseType === ItemResponseType.SingleSelection ||
      responseType === ItemResponseType.MultipleSelection
    ) {
      updateAppletForm('responseValues', { options: mapSelectionOptionsToResponse(options) });
    }
  }, [responseType, options]);

  useEffect(() => {
    if (responseType === ItemResponseType.Text) {
      updateAppletForm('config', {
        ...getValues('config'),
        maxResponseLength,
        correctAnswer,
      });
    }
  }, [responseType, maxResponseLength, correctAnswer]);
};
