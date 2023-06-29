import { ColorResult } from 'react-color';
import get from 'lodash.get';

import {
  Condition,
  ConditionalLogic,
  AudioPlayerResponseValues,
  AudioResponseValues,
  DrawingResponseValues,
  Item,
  NumberItemResponseValues,
  SingleAndMultipleSelectItemResponseValues,
  SingleAndMultipleSelectRowsResponseValues,
  SliderItemResponseValues,
  SliderRowsResponseValues,
  Activity,
  ItemAlert,
  OptionCondition,
} from 'shared/state';
import { ConditionType, ItemResponseType } from 'shared/consts';
import { getEntityKey, groupBy } from 'shared/utils';
import { CONDITION_TYPES_TO_HAVE_OPTION_ID } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.const';

import { ItemConfigurationSettings } from '../ActivityItems/ItemConfiguration';

export const removeAppletExtraFields = () => ({
  isPublished: undefined,
  reportServerIp: undefined,
  reportPublicKey: undefined,
  reportRecipients: undefined,
  reportIncludeUserId: undefined,
  reportIncludeCaseId: undefined,
  reportEmailBody: undefined,
  retentionPeriod: undefined,
  retentionType: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  id: undefined,
  theme: undefined,
  version: undefined,
});

export const removeActivityExtraFields = (activity: Activity) => ({
  createdAt: undefined,
  order: undefined,
  performanceTaskType: undefined,
  isPerformanceTask: undefined,
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
  alerts: undefined,
});

export const mapItemResponseValues = (item: Item) => {
  const { responseType, responseValues, alerts, config } = item;

  const hasAlerts = get(config, ItemConfigurationSettings.HasAlerts);

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
          alert: hasAlerts ? alerts?.find(({ value }) => value === option.id)?.alert : undefined,
        }),
      ),
    };

  if (
    responseType === ItemResponseType.Slider &&
    get(item.config, ItemConfigurationSettings.IsContinuous)
  ) {
    return {
      ...(responseValues as SliderItemResponseValues),
      options: undefined,
      alerts: hasAlerts
        ? alerts?.map(({ minValue, maxValue, alert }) => ({
            minValue,
            maxValue,
            alert,
          }))
        : undefined,
    };
  }

  if (responseType === ItemResponseType.Slider) {
    return {
      ...(responseValues as SliderItemResponseValues),
      options: undefined,
      alerts: hasAlerts
        ? alerts?.map(({ value, alert }) => ({ value: +value!, alert }))
        : undefined,
    };
  }

  if (responseType === ItemResponseType.SliderRows) {
    const { rows } = responseValues as SliderRowsResponseValues;

    return {
      ...(responseValues as SliderRowsResponseValues),
      options: undefined,
      rows: rows?.map((row) => ({
        ...row,
        alerts: hasAlerts
          ? alerts?.reduce((result: ItemAlert[], { sliderId, value, alert }) => {
              if (sliderId === row.id) return [...result, { value, alert }];

              return result;
            }, [])
          : undefined,
      })),
    };
  }

  if (
    responseType === ItemResponseType.Audio ||
    responseType === ItemResponseType.AudioPlayer ||
    responseType === ItemResponseType.NumberSelection ||
    responseType === ItemResponseType.Drawing
  )
    return {
      ...(responseValues as
        | AudioResponseValues
        | AudioPlayerResponseValues
        | NumberItemResponseValues
        | DrawingResponseValues),
      options: undefined,
    };

  if (
    responseType === ItemResponseType.SingleSelectionPerRow ||
    responseType === ItemResponseType.MultipleSelectionPerRow
  ) {
    const { dataMatrix, ...other } = responseValues as SingleAndMultipleSelectRowsResponseValues;

    const groupedAlerts = groupBy(alerts ?? [], (alert) => `${alert.optionId}-${alert.rowId}`);

    return {
      ...other,
      dataMatrix: dataMatrix?.map(({ rowId, options }) => ({
        rowId,
        options: options?.map((option) => ({
          ...option,
          alert: hasAlerts ? groupedAlerts[`${option.optionId}-${rowId}`]?.[0]?.alert : undefined,
        })),
      })),
    };
  }

  return null;
};

export const getConditionPayload = (item: Item, condition: Condition) => {
  if (!CONDITION_TYPES_TO_HAVE_OPTION_ID.includes(condition.type as ConditionType)) {
    return condition.payload;
  }

  const options = (item.responseValues as SingleAndMultipleSelectItemResponseValues)?.options;
  const optionId = (condition as OptionCondition).payload?.optionValue;

  return {
    optionValue: options?.find(({ id }) => id === optionId)?.value,
  };
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
    conditions: result.conditions?.map((condition) => {
      const relatedItem = items.find((item) => getEntityKey(item) === condition.itemName);

      return {
        type: condition.type,
        payload: getConditionPayload(relatedItem!, condition) as keyof Condition['payload'],
        itemName: relatedItem?.name ?? '',
      };
    }),
  };
};
