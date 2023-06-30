import { ColorResult } from 'react-color';
import get from 'lodash.get';

import {
  AudioPlayerResponseValues,
  AudioResponseValues,
  Condition,
  ConditionalLogic,
  DrawingResponseValues,
  ItemAlert,
  NumberItemResponseValues,
  SingleAndMultipleSelectItemResponseValues,
  SingleAndMultipleSelectRowsResponseValues,
  SliderItemResponseValues,
  SliderRowsResponseValues,
  OptionCondition,
  SectionCondition,
  ScoreCondition,
} from 'shared/state';
import { getEntityKey, getObjectFromList, groupBy } from 'shared/utils';
import { CONDITION_TYPES_TO_HAVE_OPTION_ID } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.const';
import { ConditionType, ItemResponseType } from 'shared/consts';
import { ActivityFormValues, ItemFormValues } from 'modules/Builder/types';

import { ItemConfigurationSettings } from '../ActivityItems/ItemConfiguration';
import { ElementType } from './SaveAndPublish.types';

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

export const removeActivityExtraFields = () => ({
  createdAt: undefined,
  order: undefined,
  performanceTaskType: undefined,
  isPerformanceTask: undefined,
  conditionalLogic: undefined,
});

export const remapSubscaleSettings = (activity: ActivityFormValues) => {
  if (!activity.subscaleSetting) return activity.subscaleSetting;

  const itemsObject = getObjectFromList(activity.items);
  const subscalesObject = getObjectFromList(activity.subscaleSetting?.subscales);

  return {
    ...activity.subscaleSetting,
    subscales: activity.subscaleSetting?.subscales?.map((subscale) => ({
      ...subscale,
      id: undefined,
      items: subscale.items.map((subscaleItem) => {
        if (itemsObject[subscaleItem])
          return {
            name: itemsObject[subscaleItem].name,
            type: ElementType.Item,
          };

        return {
          name: subscalesObject[subscaleItem].name,
          type: ElementType.Subscale,
        };
      }),
    })),
  } as NonNullable<ActivityFormValues['subscaleSetting']>;
};

const getConditions = (
  items: ItemFormValues[],
  conditions?: (SectionCondition | Condition | ScoreCondition)[],
) =>
  conditions?.map((condition) => {
    const relatedItem = items.find((item) => getEntityKey(item) === condition.itemName);

    return {
      type: condition.type,
      payload: getConditionPayload(relatedItem!, condition) as keyof Condition['payload'],
      itemName: relatedItem?.name ?? '',
    };
  });

export const getScoresAndReports = (activity: ActivityFormValues) => {
  const { items, scoresAndReports } = activity;
  if (!scoresAndReports) return;

  const fieldsToRemove = {
    printItems: undefined,
    showMessage: undefined,
  };

  const { sections: initialSections, scores: initialScores } = scoresAndReports;
  const scores = initialScores.map((score) => ({
    ...score,
    ...fieldsToRemove,
    conditionalLogic: score.conditionalLogic?.map((conditional) => ({
      ...conditional,
      ...fieldsToRemove,
      conditions: getConditions(items, conditional.conditions),
    })),
  }));
  const sections = initialSections.map((section) => ({
    ...section,
    ...fieldsToRemove,
    conditionalLogic: {
      ...section.conditionalLogic,
      conditions: getConditions(items, section?.conditionalLogic?.conditions),
    },
  }));

  return {
    ...scoresAndReports,
    sections,
    scores,
  };
};

export const removeActivityFlowExtraFields = () => ({
  createdAt: undefined,
});

export const removeItemExtraFields = () => ({
  key: undefined,
  settings: undefined,
  alerts: undefined,
});

export const mapItemResponseValues = (item: ItemFormValues) => {
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

export const getConditionPayload = (item: ItemFormValues, condition: Condition) => {
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
  item: ItemFormValues,
  items: ItemFormValues[],
  conditionalLogic?: ConditionalLogic[],
) => {
  const result = conditionalLogic?.find(
    (conditionalLogic) => conditionalLogic.itemKey === getEntityKey(item),
  );

  if (!result) return;

  return {
    match: result.match,
    conditions: getConditions(items, result.conditions),
  };
};
