import { FieldValues } from 'react-hook-form';
import { ColorResult } from 'react-color';
import get from 'lodash.get';

import {
  Activity,
  ActivityFlow,
  Condition,
  ConditionalLogic,
  FlankerConfig,
  Item,
  ItemAlert,
  OptionCondition,
  ScoreConditionalLogic,
  ScoreReport,
  SectionReport,
  SingleAndMultipleSelectItemResponseValues,
  SingleApplet,
} from 'shared/state';
import { ConditionType, ItemResponseType, PerfTaskType } from 'shared/consts';
import {
  getDictionaryObject,
  getEntityKey,
  getObjectFromList,
  getSanitizedContent,
  groupBy,
} from 'shared/utils';
import { REACT_HOOK_FORM_KEY_NAME } from 'modules/Builder/consts';
import {
  ABTrailsItemQuestions,
  ActivityFormValues,
  FlankerItemPositions,
  FlankerNextButton,
  ItemFormValues,
  RoundTypeEnum,
} from 'modules/Builder/types';
import { CONDITION_TYPES_TO_HAVE_OPTION_ID } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.const';
import { findRelatedScore } from 'modules/Builder/utils';
import { ElementType, isScoreReport, isSectionReport } from 'shared/types';

import { ItemConfigurationSettings } from '../ActivityItems/ItemConfiguration/ItemConfiguration.types';
import {
  GetConditions,
  GetItemCommonFields,
  GetSection,
  GetSectionConditions,
} from './SaveAndPublish.types';

const removeReactHookFormKey = () => ({
  [REACT_HOOK_FORM_KEY_NAME]: undefined,
});

export const removeAppletExtraFields = (isNewApplet: boolean) => ({
  isPublished: undefined,
  reportServerIp: undefined,
  reportPublicKey: undefined,
  reportRecipients: undefined,
  reportIncludeUserId: undefined,
  reportIncludeCaseId: undefined,
  retentionPeriod: undefined,
  retentionType: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  id: undefined,
  theme: undefined,
  version: undefined,
  ...(!isNewApplet && { reportEmailBody: undefined }),
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
  ...removeReactHookFormKey(),
});

export const removeActivityFlowExtraFields = () => ({
  createdAt: undefined,
  ...removeReactHookFormKey(),
});

export const removeActivityFlowItemExtraFields = () => ({
  ...removeReactHookFormKey(),
});

const removeItemExtraFields = () => ({
  key: undefined,
  settings: undefined,
  alerts: undefined,
  order: undefined,
  ...removeReactHookFormKey(),
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

const getConditions = ({ items, conditions, score }: GetConditions) =>
  conditions?.map((condition) => {
    const relatedItem = items.find((item) => getEntityKey(item) === condition.itemName);

    return {
      type: condition.type,
      payload: relatedItem ? getConditionPayload(relatedItem, condition) : condition['payload'],
      itemName: relatedItem?.name ?? score?.id ?? condition.itemName,
    };
  });

const getSectionConditions = ({ items, conditions, scores }: GetSectionConditions) =>
  conditions?.map((condition) => {
    const relatedItem = items.find((item) => getEntityKey(item) === condition.itemName);
    const relatedScore = findRelatedScore({
      entityKey: condition.itemName,
      scores,
      isSaving: true,
    });

    return {
      type: condition.type,
      payload: relatedItem ? getConditionPayload(relatedItem, condition) : condition['payload'],
      itemName: relatedItem?.name ?? relatedScore?.id ?? condition.itemName,
    };
  });

const removeReportsFields = () => ({
  printItems: undefined,
  showMessage: undefined,
  key: undefined,
  ...removeReactHookFormKey(),
});

export const getReportMessage = (report: ScoreReport | SectionReport | ScoreConditionalLogic) => ({
  message: report.showMessage ? getSanitizedContent(report.message ?? '', true) : undefined,
});
const getReportItemsPrint = (report: ScoreReport | SectionReport | ScoreConditionalLogic) => ({
  itemsPrint: report.printItems ? report.itemsPrint : undefined,
});

const remapItemsByName = (itemsObject: Record<string, ItemFormValues>) => (name: string) =>
  itemsObject[name].name;
const getScore = (
  score: ScoreReport,
  items: ActivityFormValues['items'],
  itemsObjectById: Record<string, ItemFormValues>,
) => ({
  ...score,
  ...removeReportsFields(),
  conditionalLogic: score.conditionalLogic?.map((conditional) => ({
    ...conditional,
    ...removeReportsFields(),
    conditions: getConditions({
      items,
      conditions: conditional.conditions,
      score,
    }),
    ...getReportMessage(conditional),
    ...getReportItemsPrint({
      ...conditional,
      itemsPrint: conditional.itemsPrint?.map(remapItemsByName(itemsObjectById)),
    }),
  })),
  itemsScore: score.itemsScore.map(remapItemsByName(itemsObjectById)),
  ...getReportMessage(score),
  ...getReportItemsPrint({
    ...score,
    itemsPrint: score.itemsPrint?.map(remapItemsByName(itemsObjectById)),
  }),
});

const getSection = ({ section, items, scores, itemsObjectById }: GetSection) => ({
  ...section,
  ...removeReportsFields(),
  id: undefined,
  ...(!!Object.keys(section.conditionalLogic || {}).length && {
    conditionalLogic: {
      ...section.conditionalLogic,
      conditions: getSectionConditions({
        items,
        conditions: section?.conditionalLogic?.conditions,
        scores,
      }),
      ...removeReactHookFormKey(),
    },
  }),
  ...getReportMessage(section),
  ...getReportItemsPrint({
    ...section,
    itemsPrint: section.itemsPrint?.map(remapItemsByName(itemsObjectById)),
  }),
});

export const getScoresAndReports = (activity: ActivityFormValues) => {
  const { items, scoresAndReports } = activity;
  if (!scoresAndReports) return;

  const itemsObjectById = getObjectFromList(items, (item) => getEntityKey(item));
  const { reports: initialReports } = scoresAndReports;

  const scores = initialReports?.filter(isScoreReport);
  const reports = initialReports?.map((report) => {
    if (isSectionReport(report)) {
      return getSection({ section: report, items, scores, itemsObjectById });
    }

    return getScore(report, items, itemsObjectById);
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
      paletteName: responseValues.paletteName || undefined,
      options: responseValues.options?.map((option) => ({
        ...option,
        color: ((option.color as ColorResult)?.hex ?? option.color) || undefined,
        alert: hasAlerts ? alerts?.find(({ value }) => value === option.id)?.alert : undefined,
        ...removeReactHookFormKey(),
      })),
    };

  if (
    responseType === ItemResponseType.Slider &&
    get(item.config, ItemConfigurationSettings.IsContinuous)
  ) {
    return {
      ...responseValues,
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
      ...responseValues,
      options: undefined,
      alerts: hasAlerts ? alerts : undefined,
    };
  }

  if (responseType === ItemResponseType.SliderRows) {
    const { rows } = responseValues;

    return {
      ...responseValues,
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
    responseType === ItemResponseType.NumberSelection
  )
    return {
      ...responseValues,
      options: undefined,
    };

  if (responseType === ItemResponseType.Drawing)
    return {
      ...responseValues,
      ...(responseValues.proportion && {
        proportion: {
          ...responseValues.proportion,
          enabled: Boolean(responseValues.proportion.enabled),
        },
      }),
      options: undefined,
    };

  if (
    responseType === ItemResponseType.SingleSelectionPerRow ||
    responseType === ItemResponseType.MultipleSelectionPerRow
  ) {
    const { dataMatrix, ...other } = responseValues;

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
    conditions: getConditions({ items, conditions: result.conditions }),
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

  const isABTrails =
    isPerformanceTask &&
    (performanceTaskType === PerfTaskType.ABTrailsMobile ||
      performanceTaskType === PerfTaskType.ABTrailsTablet);

  if (isPerformanceTask && performanceTaskType === PerfTaskType.Flanker) {
    const flankerPracticeConfig = items[FlankerItemPositions.PracticeFirst].config as FlankerConfig;
    const firstPracticeItemConfig = {
      ...flankerPracticeConfig,
      stimulusTrials: flankerPracticeConfig.stimulusTrials?.map((trial) => ({
        ...trial,
        ...removeReactHookFormKey(),
      })),
    };

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

      if (index === FlankerItemPositions.PracticeFirst) {
        return {
          ...item,
          config: firstPracticeItemConfig,
          ...itemCommonFields,
        };
      }

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

  return items?.map(({ id, ...item }, index) => ({
    ...item,
    ...getItemCommonFields({ id, item, items, conditionalLogic }),
    ...(isABTrails && {
      question: getDictionaryObject(item.question ?? ABTrailsItemQuestions[index]),
    }),
  }));
};

export const getCurrentEntitiesIds = (
  oldApplet: FieldValues,
  newApplet: SingleApplet,
  {
    isActivity,
    activityOrFlowId,
    itemId,
  }: { isActivity: boolean; activityOrFlowId?: string; itemId?: string },
) => {
  const activityOrFlowSelector = isActivity ? 'activities' : 'activityFlows';
  const activityOrFlowIndex = oldApplet?.[activityOrFlowSelector]?.findIndex(
    (entity: Activity | ActivityFlow) => getEntityKey(entity) === activityOrFlowId,
  );
  const itemIndex = oldApplet?.[activityOrFlowSelector]?.[activityOrFlowIndex]?.items?.findIndex(
    (item: Item) => getEntityKey(item) === itemId,
  );
  const newActivityOrFlow = newApplet?.[activityOrFlowSelector]?.[activityOrFlowIndex];

  return {
    newActivityOrFlowId: getEntityKey(newActivityOrFlow),
    newItemId: isActivity ? getEntityKey((newActivityOrFlow as Activity)?.items?.[itemIndex]) : '',
  };
};
