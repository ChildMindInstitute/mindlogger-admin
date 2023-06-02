import i18n from 'i18n';
import { ItemFormValues } from 'modules/Builder/types';
import { ItemResponseType } from 'shared/consts';
import { SingleAndMultipleSelectItemResponseValues } from 'shared/state';

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

export const getOptionsList = (formValues: ItemFormValues) => {
  const { responseType, responseValues } = formValues;
  if (
    responseType === ItemResponseType.SingleSelection ||
    responseType === ItemResponseType.MultipleSelection
  ) {
    return (
      (responseValues as SingleAndMultipleSelectItemResponseValues)?.options?.map(
        (option, index) => ({
          labelKey: getOptionName(OptionTypes.Option, index, option.text),
          value: option.id,
        }),
      ) || []
    );
  }
  //TODO: add when items will be connected to the form
  // if (
  //   itemsInputType === ItemResponseType.SingleSelectionPerRow ||
  //   itemsInputType === ItemResponseType.MultipleSelectionPerRow
  // ) {
  //   return (
  //     selectionRows?.options?.map((option, index) => ({
  //       labelKey: getOptionName(OptionTypes.Option, index, option.label),
  //       value: option.id,
  //     })) || []
  //   );
  // }
  // if (itemsInputType === ItemResponseType.SliderRows) {
  //   return (
  //     sliderOptions?.map((sliderOption, index) => ({
  //       labelKey: getOptionName(OptionTypes.Slider, index, sliderOption.label),
  //       value: sliderOption.id,
  //     })) || []
  //   );
  // }

  return [];
};

export const getItemsList = (formValues: ItemFormValues) =>
  // const { responseType, responseValues } = formValues;
  // if (
  //   responseType === ItemResponseType.SingleSelectionPerRow ||
  //   responseType === ItemResponseType.MultipleSelectionPerRow
  // ) {
  //   return (
  //     selectionRows?.items.map((selectionRow, index) => ({
  //       labelKey: getOptionName(OptionTypes.Row, index, selectionRow.label),
  //       value: selectionRow.id,
  //     })) || []
  //   );
  // }

  [];
