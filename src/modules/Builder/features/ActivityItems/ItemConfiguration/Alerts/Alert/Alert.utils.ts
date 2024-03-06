import i18n from 'i18n';
import { ItemFormValues, ItemFormValuesCommonType } from 'modules/Builder/types';
import { ItemResponseType } from 'shared/consts';
import { ItemAlert, SliderRowsItem } from 'shared/state';
import { createArray, groupBy } from 'shared/utils';
import { Option } from 'shared/components/FormComponents';
import { DEFAULT_SLIDER_MIN_NUMBER, DEFAULT_SLIDER_MAX_NUMBER } from 'modules/Builder/consts';

import { OptionTypes } from './Alert.types';

const getOptionName = (type: OptionTypes, index: number, optionText = '') => {
  const { t } = i18n;
  const option = `${t(type)} ${index + 1}`;

  return optionText ? `${option}: ${optionText}` : option;
};

export const getSliderOptions = (min: number, max: number) =>
  Array.from({ length: max - min + 1 }, (_, i) => i + min).map((item) => ({
    labelKey: item.toString(),
    value: item.toString(),
  }));

export const getOptionsList = (formValues: ItemFormValues, alert: ItemAlert) => {
  const { responseType, responseValues, alerts } = formValues;
  if (
    responseType === ItemResponseType.SingleSelection ||
    responseType === ItemResponseType.MultipleSelection
  ) {
    const { options } = responseValues ?? {};

    return (
      options?.reduce((result: Option[], option, index) => {
        if (alerts?.some(({ value }) => value === option.id && option.id !== alert?.value))
          return result;

        return [
          ...result,
          {
            labelKey: getOptionName(OptionTypes.Option, index, option.text),
            value: option.id ?? '',
          },
        ];
      }, []) || []
    );
  }

  if (
    responseType === ItemResponseType.SingleSelectionPerRow ||
    responseType === ItemResponseType.MultipleSelectionPerRow
  ) {
    const { options, rows } = responseValues ?? {};

    return options?.reduce((result: Option[], option, index) => {
      const alertsWithOption = alerts?.filter(({ optionId }) => optionId === option.id);

      if (alertsWithOption?.length === rows?.length && alert?.optionId !== option.id) return result;

      const hasSameAlert = alertsWithOption?.some(
        ({ rowId, key }) => alert?.rowId && rowId === alert?.rowId && key !== alert?.key,
      );

      if (hasSameAlert) return result;

      return [
        ...result,
        { labelKey: getOptionName(OptionTypes.Option, index, option.text), value: option.id ?? '' },
      ];
    }, []);
  }

  if (responseType === ItemResponseType.SliderRows) {
    return (
      responseValues?.rows?.map(({ id, label }, index) => ({
        labelKey: getOptionName(OptionTypes.Slider, index, label),
        value: id ?? '',
      })) || []
    );
  }

  return [];
};

export const getItemsList = (formValues: ItemFormValues, alert: ItemAlert) => {
  const { responseType, responseValues, alerts } = formValues;
  if (
    responseType === ItemResponseType.SingleSelectionPerRow ||
    responseType === ItemResponseType.MultipleSelectionPerRow
  ) {
    const { rows, options } = responseValues ?? {};

    const alertsByRow = groupBy(alerts ?? [], 'rowId');

    return rows?.reduce((result: Option[], row, index) => {
      const alertsWithRow = alertsByRow[row.id];

      if (alertsWithRow?.length === options?.length && alert?.rowId !== row.id) return result;

      const hasSameAlert = alertsWithRow?.some(
        ({ optionId, key }) =>
          alert?.optionId && optionId === alert?.optionId && key !== alert?.key,
      );

      if (hasSameAlert) return result;

      return [
        ...result,
        { labelKey: getOptionName(OptionTypes.Row, index, row.rowName), value: row.id },
      ];
    }, []);
  }

  return [];
};

export const getSliderRowsItemList = (
  formValues: SliderRowsItem<ItemFormValuesCommonType>,
  { sliderId }: ItemAlert,
) => {
  const { responseValues, alerts } = formValues;
  if (!sliderId) return [];

  const { minValue, maxValue } = responseValues?.rows?.find(({ id }) => id === sliderId) ?? {};
  const alertsNumbersToExclude = alerts?.reduce((acc: string[], alert) => {
    if (alert.sliderId === sliderId && alert.value) {
      acc.push(String(alert.value));
    }

    return acc;
  }, []);

  if ([minValue, maxValue].includes(undefined)) return [];
  const maxValueNumber =
    Number(maxValue) > DEFAULT_SLIDER_MAX_NUMBER ? DEFAULT_SLIDER_MAX_NUMBER : Number(maxValue);
  const minValueNumber =
    Number(minValue) < DEFAULT_SLIDER_MIN_NUMBER ? DEFAULT_SLIDER_MIN_NUMBER : Number(minValue);

  return createArray(maxValueNumber - minValueNumber + 1, (index) => {
    const value = `${minValueNumber + index}`;

    return {
      value,
      labelKey: value,
      hidden: alertsNumbersToExclude?.includes(value),
    };
  });
};
