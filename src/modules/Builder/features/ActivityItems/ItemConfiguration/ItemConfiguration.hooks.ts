import { useFieldArray, useFormContext } from 'react-hook-form';
import { useEffect } from 'react';

import { ItemInputTypes } from 'shared/types';

import {
  OptionalItemSetupProps,
  SettingsSetupProps,
  ItemConfigurationSettings,
} from './ItemConfiguration.types';
import { DEFAULT_TIMER_VALUE } from './ItemConfiguration.const';
import { getEmptySliderOption } from './ItemConfiguration.utils';

export const useOptionalItemSetup = ({
  name,
  defaultValue = '',
  itemType,
}: OptionalItemSetupProps) => {
  const { control, setValue, getValues } = useFormContext();

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

  return { control };
};

export const useSettingsSetup = ({ control, setValue, getValues, watch }: SettingsSetupProps) => {
  const selectedInputType = watch('itemsInputType');
  const settings = watch('settings');
  const { remove: removeOptions } = useFieldArray({
    control,
    name: 'options',
  });
  const { remove: removeAlert } = useFieldArray({
    control,
    name: 'alerts',
  });

  const hasTimer = settings?.includes(ItemConfigurationSettings.HasTimer);
  const hasAlerts = settings?.includes(ItemConfigurationSettings.HasAlerts);
  const isTextInputOptionVisible = settings?.includes(ItemConfigurationSettings.HasTextInput);

  useEffect(() => {
    setValue('settings', []);
    setValue('timer', DEFAULT_TIMER_VALUE);
    removeOptions();

    if (
      selectedInputType === ItemInputTypes.Slider ||
      selectedInputType === ItemInputTypes.SliderRows
    ) {
      setValue('sliderOptions', [getEmptySliderOption()]);
    } else setValue('sliderOptions', undefined);
  }, [selectedInputType]);

  useEffect(() => {
    !hasAlerts && removeAlert();
  }, [hasAlerts]);

  useEffect(() => {
    if (hasTimer) {
      const initialValue = getValues()['timer'];
      if (initialValue === undefined) {
        setValue('timer', DEFAULT_TIMER_VALUE);
      }

      return;
    }

    setValue('timer', undefined);
  }, [selectedInputType, hasTimer]);

  useEffect(() => {
    if (isTextInputOptionVisible) {
      const initialValue = getValues()['isTextInputOptionRequired'];
      if (initialValue === undefined) {
        setValue('isTextInputOptionRequired', true);
      }

      return;
    }

    setValue('isTextInputOptionRequired', undefined);
  }, [selectedInputType, isTextInputOptionVisible]);
};
