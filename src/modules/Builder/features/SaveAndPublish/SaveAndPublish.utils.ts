import { ColorResult } from 'react-color';

import {
  Condition,
  ConditionalLogic,
  AudioPlayerResponseValues,
  AudioResponseValues,
  DrawingResponseValues,
  Item,
  NumberItemResponseValues,
  ResponseValues,
  SingleAndMultipleSelectItemResponseValues,
  SingleAndMultipleSelectRowsResponseValues,
  SliderItemResponseValues,
  SliderRowsResponseValues,
  Activity,
} from 'shared/state';
import { ItemResponseType } from 'shared/consts';
import { getEntityKey } from 'shared/utils';

export const removeAppletExtraFields = (isNewApplet: boolean) => ({
  ...(isNewApplet
    ? {}
    : {
        isPublished: undefined,
        reportServerIp: undefined,
        reportPublicKey: undefined,
        reportRecipients: undefined,
        reportIncludeUserId: undefined,
        reportIncludeCaseId: undefined,
        reportEmailBody: undefined,
      }),
  createdAt: undefined,
  updatedAt: undefined,
  id: undefined,
  retentionPeriod: undefined,
  retentionType: undefined,
  theme: undefined,
  version: undefined,
});

export const removeActivityExtraFields = (activity: Activity) => ({
  createdAt: undefined,
  order: undefined,
  generateReport: undefined, // TODO: remove when API will be ready
  showScoreSummary: undefined, // TODO: remove when API will be ready
  scores: undefined, // TODO: remove when API will be ready
  sections: undefined, // TODO: remove when API will be ready
  conditionalLogic: undefined,
  subscaleSetting: {
    ...activity.subscaleSetting,
    subscales: activity.subscaleSetting?.subscales?.map((item) => ({
      ...item,
      id: undefined,
    })),
  },
});

export const removeActivityFlowExtraFields = () => ({
  createdAt: undefined,
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
    responseType === ItemResponseType.Audio ||
    responseType === ItemResponseType.AudioPlayer ||
    responseType === ItemResponseType.NumberSelection ||
    responseType === ItemResponseType.Drawing ||
    responseType === ItemResponseType.SliderRows
  )
    return {
      ...(responseValues as
        | SliderItemResponseValues
        | AudioResponseValues
        | AudioPlayerResponseValues
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

export const getItemConditionalLogic = (
  item: Item,
  items: Item[],
  conditionalLogic?: ConditionalLogic[],
) => {
  const result = conditionalLogic?.find(
    (conditionalLogic) => conditionalLogic.itemKey === getEntityKey(item),
  );

  if (!result) return;

  return {
    match: result.match,
    conditions: result.conditions?.map(({ type, payload, itemName }) => ({
      type,
      payload: payload as keyof Condition['payload'],
      itemName: items.find((item) => getEntityKey(item) === itemName)?.name ?? '',
    })),
  };
};
