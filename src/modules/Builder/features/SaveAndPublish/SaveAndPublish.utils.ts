import {
  DrawingResponseValues,
  NumberItemResponseValues,
  ResponseValues,
  SingleAndMultipleSelectItemResponseValues,
  SingleAndMultipleSelectRowsResponseValues,
  SliderItemResponseValues,
  SliderRowsResponseValues,
} from 'shared/state';
import { ItemResponseType } from 'shared/consts';
import { ColorResult } from 'react-color';

export const removeAppletExtraFields = () => ({
  createdAt: undefined,
  updatedAt: undefined,
  id: undefined,
  retentionPeriod: undefined,
  retentionType: undefined,
  theme: undefined,
  version: undefined,
});

export const removeActivityExtraFields = () => ({
  order: undefined,
  generateReport: undefined, // TODO: remove when API will be ready
  showScoreSummary: undefined, // TODO: remove when API will be ready
  scores: undefined, // TODO: remove when API will be ready
  sections: undefined, // TODO: remove when API will be ready
  subscales: undefined, // TODO: remove when API will be ready
  calculateTotalScore: undefined, // TODO: remove when API will be ready
});

export const removeItemExtraFields = () => ({
  key: undefined,
  settings: undefined,
  alerts: undefined, //TODO: remove after backend addings
});

export const mapItemResponseValues = (
  responseType: ItemResponseType,
  responseValues: ResponseValues,
) => {
  if (
    responseType === ItemResponseType.SingleSelection ||
    responseType === ItemResponseType.MultipleSelection
  )
    return {
      paletteName:
        (responseValues as SingleAndMultipleSelectItemResponseValues).paletteName ?? undefined,
      options: (responseValues as SingleAndMultipleSelectItemResponseValues).options?.map(
        (option) => ({
          ...option,
          color: ((option.color as ColorResult)?.hex ?? option.color) || undefined,
        }),
      ),
    };

  if (
    responseType === ItemResponseType.Slider ||
    responseType === ItemResponseType.NumberSelection ||
    responseType === ItemResponseType.Drawing ||
    responseType === ItemResponseType.SliderRows
  )
    return {
      ...(responseValues as
        | SliderItemResponseValues
        | NumberItemResponseValues
        | DrawingResponseValues
        | SliderRowsResponseValues),
      options: undefined,
    };

  if (
    responseType === ItemResponseType.SingleSelectionPerRow ||
    responseType === ItemResponseType.MultipleSelectionPerRow
  )
    return responseValues as SingleAndMultipleSelectRowsResponseValues;

  return null;
};
