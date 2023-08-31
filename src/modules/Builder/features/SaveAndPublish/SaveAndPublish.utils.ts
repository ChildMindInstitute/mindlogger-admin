import { FieldValues } from 'react-hook-form';
import { ColorResult } from 'react-color';
import get from 'lodash.get';

import {
  AudioPlayerResponseValues,
  AudioResponseValues,
  Condition,
  ConditionalLogic,
  DrawingResponseValues,
  FlankerConfig,
  ItemAlert,
  NumberItemResponseValues,
  SingleAndMultipleSelectItemResponseValues,
  SingleAndMultipleSelectRowsResponseValues,
  SliderItemResponseValues,
  SliderRowsResponseValues,
  OptionCondition,
  SectionCondition,
  SingleApplet,
  Activity,
  ActivityFlow,
  ScoreReport,
  SectionReport,
} from 'shared/state';
import { ConditionType, ItemResponseType, PerfTaskType, ScoreReportType } from 'shared/consts';
import { getDictionaryObject, getEntityKey, getObjectFromList, groupBy } from 'shared/utils';
import {
  ActivityFormValues,
  FlankerItemPositions,
  FlankerNextButton,
  ItemFormValues,
  RoundTypeEnum,
} from 'modules/Builder/types';
import { CONDITION_TYPES_TO_HAVE_OPTION_ID } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.const';
import { ElementType } from 'shared/types';

import { ItemConfigurationSettings } from '../ActivityItems/ItemConfiguration';
import { GetItemCommonFields } from './SaveAndPublish.types';

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
  //for the newly created activities/activityFlow to avoid { undefined: { items: [] }} problem
  //for the case when updated activityId/activityFlowId comes from the server but storage is still not updated
  undefined,
});

export const removeActivityExtraFields = () => ({
  createdAt: undefined,
  order: undefined,
  performanceTaskType: undefined,
  isPerformanceTask: undefined,
  conditionalLogic: undefined,
  reportIncludedItemName: undefined,
});

export const removeActivityFlowExtraFields = () => ({
  createdAt: undefined,
  reportIncludedItemName: undefined,
  reportIncludedActivityName: undefined,
});

const removeItemExtraFields = () => ({
  key: undefined,
  settings: undefined,
  alerts: undefined,
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

const getConditions = (items: ItemFormValues[], conditions?: (SectionCondition | Condition)[]) =>
  conditions?.map((condition) => {
    const relatedItem = items.find((item) => getEntityKey(item) === condition.itemName);

    return {
      type: condition.type,
      payload: relatedItem
        ? (getConditionPayload(relatedItem, condition) as keyof Condition['payload'])
        : condition['payload'],
      itemName: relatedItem?.name ?? condition.itemName,
    };
  });

const removeReportsFields = () => ({
  printItems: undefined,
  showMessage: undefined,
});

const getScore = (score: ScoreReport, items: ActivityFormValues['items']) => ({
  ...score,
  ...removeReportsFields(),
  conditionalLogic: score.conditionalLogic?.map((conditional) => ({
    ...conditional,
    ...removeReportsFields(),
    conditions: getConditions(items, conditional.conditions),
  })),
});

const getSection = (section: SectionReport, items: ActivityFormValues['items']) => ({
  ...section,
  ...removeReportsFields(),
  ...(!!Object.keys(section.conditionalLogic || {}).length && {
    conditionalLogic: {
      ...section.conditionalLogic,
      conditions: getConditions(items, section?.conditionalLogic?.conditions),
    },
  }),
});

export const getScoresAndReports = (activity: ActivityFormValues) => {
  const { items, scoresAndReports } = activity;
  if (!scoresAndReports) return;

  const { reports: initialReports } = scoresAndReports;

  const reports = initialReports?.map((report) => {
    if (report.type === ScoreReportType.Section) {
      return getSection(report as SectionReport, items);
    }

    return getScore(report as ScoreReport, items);
  });

  return {
    ...scoresAndReports,
    reports,
  };
};

const mapItemResponseValues = (item: ItemFormValues) => {
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

const getItemCommonFields = ({ id, item, items, conditionalLogic }: GetItemCommonFields) => ({
  ...(id && { id }),
  question: getDictionaryObject(item.question),
  responseValues: mapItemResponseValues(item) || null,
  conditionalLogic: getItemConditionalLogic({ ...item, id }, items, conditionalLogic),
  ...removeItemExtraFields(),
});

export const getActivityItems = (activity: ActivityFormValues) => {
  const { items, conditionalLogic, isPerformanceTask, performanceTaskType } = activity;

  if (isPerformanceTask && performanceTaskType === PerfTaskType.Flanker) {
    const firstPracticeItemConfig = items[FlankerItemPositions.PracticeFirst]
      .config as FlankerConfig;
    const firstTestItemConfig = items[FlankerItemPositions.TestFirst].config as FlankerConfig;
    const testItemCommonConfig = {
      blockType: RoundTypeEnum.Test,
      blocks: firstTestItemConfig.blocks,
      minimumAccuracy: undefined,
      trialDuration: firstTestItemConfig.trialDuration,
      samplingMethod: firstTestItemConfig.samplingMethod,
      showFeedback: firstTestItemConfig.showFeedback,
      showResults: firstTestItemConfig.showResults,
      isFirstPractice: false,
      isLastPractice: false,
    };

    return items?.map(({ id, ...item }, index) => {
      const itemCommonFields = getItemCommonFields({ id, item, items, conditionalLogic });
      const isLastTest = index === FlankerItemPositions.TestThird;

      if (
        index === FlankerItemPositions.PracticeSecond ||
        index === FlankerItemPositions.PracticeThird
      ) {
        return {
          ...item,
          config: {
            ...firstPracticeItemConfig,
            isFirstPractice: false,
            isLastPractice: index === FlankerItemPositions.PracticeThird,
          },
          ...itemCommonFields,
        };
      }

      if (
        index === FlankerItemPositions.TestFirst ||
        index === FlankerItemPositions.TestSecond ||
        index === FlankerItemPositions.TestThird
      ) {
        return {
          ...item,
          config: {
            ...firstPracticeItemConfig,
            ...testItemCommonConfig,
            nextButton: isLastTest ? FlankerNextButton.Finish : FlankerNextButton.Continue,
            isLastTest,
          },
          ...itemCommonFields,
        };
      }

      return {
        ...item,
        ...itemCommonFields,
      };
    });
  }

  return items?.map(({ id, ...item }) => ({
    ...item,
    ...getItemCommonFields({ id, item, items, conditionalLogic }),
  }));
};

export const getCurrentEntityId = (
  oldApplet: FieldValues,
  newApplet: SingleApplet,
  { isActivity, id }: { isActivity: boolean; id?: string },
) => {
  const itemsSelector = isActivity ? 'activities' : 'activityFlows';
  const index = oldApplet?.[itemsSelector]?.findIndex(
    (entity: Activity | ActivityFlow) => getEntityKey(entity) === id,
  );

  return getEntityKey(newApplet?.[itemsSelector]?.[index]);
};
