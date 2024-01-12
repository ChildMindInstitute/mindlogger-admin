import { matchPath } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ColorResult } from 'react-color';
import get from 'lodash.get';
import * as yup from 'yup';

import i18n from 'i18n';
import { page } from 'resources';
import { Svg } from 'shared/components/Svg';
import { Theme } from 'modules/Builder/api';
import {
  Activity,
  ActivityFlow,
  Condition,
  ConditionalLogic,
  Config,
  Item,
  ItemAlert,
  OptionCondition,
  ScoreCondition,
  ScoreConditionalLogic,
  ScoreReport,
  ScoresAndReports,
  SectionReport,
  SingleAndMultipleSelectItemResponseValues,
  SingleAndMultiSelectOption,
  SingleApplet,
} from 'shared/state';
import {
  createArray,
  getDictionaryText,
  getEntityKey,
  getObjectFromList,
  getTextBetweenBrackets,
  INTERVAL_SYMBOL,
  isSystemItem,
  Path,
  pluck,
} from 'shared/utils';
import {
  ConditionType,
  DEFAULT_LAMBDA_SLOPE,
  DEFAULT_LENGTH_OF_TEST,
  DEFAULT_MILLISECONDS_DURATION,
  DEFAULT_NUMBER_OF_TRIALS,
  DEFAULT_THRESHOLD_DURATION,
  GyroscopeOrTouch,
  ItemResponseType,
  LookupTableItems,
  PerfTaskType,
  ScoreConditionType,
  ScoreReportType,
} from 'shared/consts';
import {
  ABTrailsItemQuestions,
  ActivityFlowFormValues,
  ActivityFormValues,
  AppletFormValues,
  CorrectPress,
  DeviceType,
  FlankerItemNames,
  FlankerNextButton,
  FlankerSamplingMethod,
  GetActivitySubscaleItems,
  GetActivitySubscaleSettingDuplicated,
  GetNewActivity,
  GetNewPerformanceTask,
  GyroscopeItemNames,
  ItemFormValues,
  OrderName,
  RoundTypeEnum,
  TouchItemNames,
} from 'modules/Builder/types';
import { ItemConfigurationSettings } from 'modules/Builder/features/ActivityItems/ItemConfiguration/ItemConfiguration.types';
import {
  findRelatedScore,
  FlowReportFieldsPrepareType,
  getEntityReportFields,
  getUniqueName,
} from 'modules/Builder/utils';
import {
  DEFAULT_MIN_NUMBER,
  DEFAULT_SLIDER_MAX_NUMBER,
  DEFAULT_SLIDER_MIN_NUMBER,
  DEFAULT_SLIDER_ROWS_MIN_NUMBER,
} from 'modules/Builder/consts';

import {
  ALLOWED_TYPES_IN_VARIABLES,
  CONDITION_TYPES_TO_HAVE_OPTION_ID,
  defaultFlankerBtnObj,
  ordinalStrings,
  SAMPLE_SIZE,
} from './BuilderApplet.const';
import { GetSectionConditions, GetMessageItem, PerformanceTaskItems } from './BuilderApplet.types';

const { t } = i18n;

export const getDefaultThemeId = (themesList: Theme[]) =>
  themesList.find((theme) => theme.name === 'Default')?.id || '';

export const isAppletRoute = (path: string) => matchPath(`${page.builderApplet}/*`, path);

const getDuplicatedOptionsAndAlerts = (item?: ItemFormValues) => {
  const { responseValues, alerts } = item || {};
  const newIdsObject: Record<string, string> = {};
  const options = (responseValues as SingleAndMultipleSelectItemResponseValues)?.options?.map(
    (option: SingleAndMultiSelectOption) => {
      const id = uuidv4();
      newIdsObject[option.id] = id;

      return { ...option, id };
    },
  );

  const mappedAlerts = alerts
    ? {
        alerts: alerts.map((alert) => ({
          ...alert,
          value: newIdsObject[alert.value ?? ''],
          key: uuidv4(),
        })),
      }
    : {};

  return {
    responseValues: {
      ...responseValues,
      options,
    },
    ...mappedAlerts,
  };
};

export const getNewActivityItem = (item?: ItemFormValues) =>
  ({
    responseType: '',
    name: t('newItem'),
    question: '',
    config: {} as Config,
    isHidden: false,
    allowEdit: true,
    ...item,
    id: undefined,
    key: uuidv4(),
    ...((item?.responseType === ItemResponseType.SingleSelection ||
      item?.responseType === ItemResponseType.MultipleSelection) &&
      getDuplicatedOptionsAndAlerts(item)),
    ...(item?.responseType === ItemResponseType.Slider && {
      responseValues: {
        ...item.responseValues,
        id: uuidv4(),
      },
      alerts: item?.alerts?.map((alert) => ({
        ...alert,
        key: uuidv4(),
      })),
    }),
  }) as ItemFormValues;

export const getDuplicatedConditions = (
  oldItems: ItemFormValues[],
  newItems: Record<string, unknown>[],
  conditions?: Condition[],
  scores?: ScoreReport[],
  scoreConditionalLogic?: ScoreConditionalLogic[],
) =>
  conditions?.map((condition) => {
    const optionValue = (condition as OptionCondition)?.payload.optionValue;
    const itemIndex = oldItems.findIndex((item) => condition.itemName === getEntityKey(item));
    const score = scores?.find((score) => condition.itemName === getEntityKey(score, false));
    const scoreCondition = scoreConditionalLogic?.find(
      (scoreCondition) => condition.itemName === getEntityKey(scoreCondition, false),
    );
    const itemName =
      (getEntityKey(newItems[itemIndex]) ||
        (score && getEntityKey(score, false)) ||
        (scoreCondition && getEntityKey(scoreCondition, false))) ??
      '';
    const result = {
      ...condition,
      itemName,
      key: uuidv4(),
    };

    if (!optionValue) return result;

    const optionIndex = (
      oldItems[itemIndex]?.responseValues as SingleAndMultipleSelectItemResponseValues
    ).options?.findIndex((option) => option.id === optionValue);

    return {
      ...result,
      payload: {
        optionValue:
          (newItems[itemIndex]?.responseValues as SingleAndMultipleSelectItemResponseValues)
            ?.options?.[optionIndex]?.id ?? '',
      },
    };
  });

export const getDuplicatedConditional = (
  oldItems: ItemFormValues[],
  newItems: Record<string, unknown>[],
  conditionalLogic?: ConditionalLogic[],
) =>
  conditionalLogic?.map((conditional) => {
    const itemKey = conditional.itemKey;

    if (itemKey) {
      const itemIndex = oldItems?.findIndex((item) => itemKey === getEntityKey(item));

      return {
        ...conditional,
        key: uuidv4(),
        itemKey: getEntityKey(newItems?.[itemIndex]) ?? '',
        conditions: getDuplicatedConditions(oldItems, newItems, conditional.conditions),
      };
    }

    return {
      ...conditional,
      itemKey,
    };
  }) ?? [];

const oldToNewIdRemapper = (newItemsObjectByOldId: Record<string, string>) => (id: string) =>
  newItemsObjectByOldId[id] ?? id;

const getDuplicatedScoresAndReports = ({
  oldItems,
  newItems,
  scoresAndReports,
  newItemsObjectByOldId,
}: {
  oldItems: ItemFormValues[];
  newItems: Record<string, unknown>[];
  scoresAndReports?: ScoresAndReports;
  newItemsObjectByOldId: Record<string, string>;
}) => {
  const reports = scoresAndReports?.reports?.map((report) => {
    let conditionalLogic;
    if (report.type === ScoreReportType.Section) {
      const { scoreReports, scoreConditionals } = (scoresAndReports?.reports || []).reduce(
        (
          result: { scoreReports: ScoreReport[]; scoreConditionals: ScoreConditionalLogic[] },
          report,
        ) => {
          if (report.type === ScoreReportType.Score) {
            result.scoreReports.push(report);
            result.scoreConditionals.push(...(report.conditionalLogic || []));
          }

          return result;
        },
        { scoreReports: [], scoreConditionals: [] },
      );
      conditionalLogic = report.conditionalLogic && {
        ...report.conditionalLogic,
        conditions: getDuplicatedConditions(
          oldItems,
          newItems,
          report.conditionalLogic?.conditions,
          scoreReports,
          scoreConditionals,
        ),
      };

      return {
        ...report,
        conditionalLogic,
        itemsPrint: report.itemsPrint?.map(oldToNewIdRemapper(newItemsObjectByOldId)),
      };
    }

    return {
      ...report,
      itemsPrint: report.itemsPrint?.map(oldToNewIdRemapper(newItemsObjectByOldId)),
      itemsScore: report.itemsScore?.map(oldToNewIdRemapper(newItemsObjectByOldId)),
      conditionalLogic: report.conditionalLogic?.map((conditional) => ({
        ...conditional,
        itemsPrint: conditional.itemsPrint?.map(oldToNewIdRemapper(newItemsObjectByOldId)),
      })),
    };
  });

  return {
    ...scoresAndReports,
    reports,
  };
};

export const getNewActivity = ({ name, activity }: GetNewActivity) => {
  const items = activity?.items?.map((item) => getNewActivityItem(item)) || [];
  const conditionalLogic = getDuplicatedConditional(
    activity?.items ?? [],
    items,
    activity?.conditionalLogic,
  );
  const newItemsObjectByOldId =
    activity?.items?.reduce(
      (acc, item, currentIndex) => ({
        ...acc,
        [getEntityKey(item)]: getEntityKey(items[currentIndex]),
      }),
      {} as Record<string, string>,
    ) ?? {};
  const subscaleSetting = getActivitySubscaleSettingDuplicated({
    oldSubscaleSetting: activity?.subscaleSetting,
    newItemsObjectByOldId,
  });
  const scoresAndReports = Object.keys(activity?.scoresAndReports || {})?.length
    ? getDuplicatedScoresAndReports({
        oldItems: activity?.items ?? [],
        newItems: items,
        scoresAndReports: activity?.scoresAndReports,
        newItemsObjectByOldId,
      })
    : {
        generateReport: false,
        reports: [],
        showScoreSummary: false,
      };

  return {
    name: name ?? t('newActivity'),
    description: '',
    showAllAtOnce: false,
    isSkippable: false,
    responseIsEditable: true,
    isHidden: false,
    ...activity,
    isReviewable: false,
    items,
    scoresAndReports,
    conditionalLogic,
    subscaleSetting,
    id: undefined,
    key: uuidv4(),
  } as ActivityFormValues;
};

const defaultMessageConfig = {
  removeBackButton: true,
  timer: null,
};

const getMessageItem = ({ name, question, order }: GetMessageItem) => ({
  name,
  config: defaultMessageConfig,
  question,
  responseType: ItemResponseType.Message,
  order,
});

export const getGyroscopeOrTouchItems = (type: GyroscopeOrTouch) => {
  const commonConfigProps = {
    trialsNumber: DEFAULT_NUMBER_OF_TRIALS,
    durationMinutes: DEFAULT_LENGTH_OF_TEST,
    lambdaSlope: DEFAULT_LAMBDA_SLOPE,
  };
  const isGyroscope = type === GyroscopeOrTouch.Gyroscope;

  return [
    getMessageItem({
      name: isGyroscope ? GyroscopeItemNames.GeneralInstruction : TouchItemNames.GeneralInstruction,
      question: t(
        `gyroscopeAndTouchInstructions.overview.${
          isGyroscope ? 'instructionGyroscope' : 'instructionTouch'
        }`,
      ),
      order: 1,
    }),
    getMessageItem({
      name: isGyroscope
        ? GyroscopeItemNames.PracticeInstruction
        : TouchItemNames.PracticeInstruction,
      question: t('gyroscopeAndTouchInstructions.practice.instruction'),
      order: 2,
    }),
    {
      name: isGyroscope ? GyroscopeItemNames.PracticeRound : TouchItemNames.PracticeRound,
      config: {
        ...commonConfigProps,
        userInputType: isGyroscope ? GyroscopeOrTouch.Gyroscope : GyroscopeOrTouch.Touch,
        phase: RoundTypeEnum.Practice,
      },
      responseType: ItemResponseType.StabilityTracker,
      order: 3,
    },
    getMessageItem({
      name: isGyroscope ? GyroscopeItemNames.TestInstruction : TouchItemNames.TestInstruction,
      question: t('gyroscopeAndTouchInstructions.test.instruction'),
      order: 4,
    }),
    {
      name: isGyroscope ? GyroscopeItemNames.TestRound : TouchItemNames.TestRound,
      config: {
        ...commonConfigProps,
        userInputType: isGyroscope ? GyroscopeOrTouch.Gyroscope : GyroscopeOrTouch.Touch,
        phase: RoundTypeEnum.Test,
      },
      responseType: ItemResponseType.StabilityTracker,
      order: 5,
    },
  ];
};

const defaultFlankerCommonConfig = {
  stimulusTrials: [],
  blocks: [],
  buttons: [defaultFlankerBtnObj, { ...defaultFlankerBtnObj, value: CorrectPress.Right }],
  showFixation: false,
  fixationScreen: null,
  fixationDuration: null,
  samplingMethod: FlankerSamplingMethod.Randomize,
  showResults: true,
  trialDuration: DEFAULT_MILLISECONDS_DURATION,
  sampleSize: SAMPLE_SIZE,
};

const defaultFlankerPracticeConfig = {
  showFeedback: true,
  minimumAccuracy: DEFAULT_THRESHOLD_DURATION,
  isLastTest: false,
  blockType: RoundTypeEnum.Practice,
  nextButton: FlankerNextButton.Ok,
};

const defaultFlankerTestConfig = {
  showFeedback: false,
  isFirstPractice: false,
  isLastPractice: false,
  blockType: RoundTypeEnum.Test,
};

export const flankerItems = [
  getMessageItem({
    name: FlankerItemNames.GeneralInstruction,
    question: t('flankerInstructions.general'),
    order: 1,
  }), //0 General Instruction
  getMessageItem({
    name: FlankerItemNames.PracticeInstructionFirst,
    question: t('flankerInstructions.practice'),
    order: 2,
  }), //1 Practice Instruction
  {
    name: FlankerItemNames.PracticeFirst,
    config: {
      ...defaultFlankerCommonConfig,
      ...defaultFlankerPracticeConfig,
      isFirstPractice: true,
      isLastPractice: false,
    },
    responseType: ItemResponseType.Flanker,
    order: 3,
  }, //2 PracticeFirst
  getMessageItem({
    name: FlankerItemNames.PracticeInstructionSecond,
    question: t('flankerInstructions.next'),
    order: 4,
  }), //3
  {
    name: FlankerItemNames.PracticeSecond,
    config: {
      ...defaultFlankerCommonConfig,
      ...defaultFlankerPracticeConfig,
      isFirstPractice: false,
      isLastPractice: false,
    },
    responseType: ItemResponseType.Flanker,
    order: 5,
  }, //4 PracticeSecond
  getMessageItem({
    name: FlankerItemNames.PracticeInstructionThird,
    question: t('flankerInstructions.next'),
    order: 6,
  }), //5
  {
    name: FlankerItemNames.PracticeThird,
    config: {
      ...defaultFlankerCommonConfig,
      ...defaultFlankerPracticeConfig,
      isFirstPractice: false,
      isLastPractice: true,
    },
    responseType: ItemResponseType.Flanker,
    order: 7,
  }, //6 PracticeThird
  getMessageItem({
    name: FlankerItemNames.TestInstructionFirst,
    question: t('flankerInstructions.test'),
    order: 8,
  }), //7 Test Instruction
  {
    name: FlankerItemNames.TestFirst,
    config: {
      ...defaultFlankerCommonConfig,
      ...defaultFlankerTestConfig,
      isLastTest: false,
    },
    responseType: ItemResponseType.Flanker,
    order: 9,
  }, //8 TestFirst
  getMessageItem({
    name: FlankerItemNames.TestInstructionSecond,
    question: t('flankerInstructions.next'),
    order: 10,
  }), //9
  {
    name: FlankerItemNames.TestSecond,
    config: {
      ...defaultFlankerCommonConfig,
      ...defaultFlankerTestConfig,
      isLastTest: false,
    },
    responseType: ItemResponseType.Flanker,
    order: 11,
  }, //10 TestSecond
  getMessageItem({
    name: FlankerItemNames.TestInstructionThird,
    question: t('flankerInstructions.next'),
    order: 12,
  }), //11
  {
    name: FlankerItemNames.TestThird,
    config: {
      ...defaultFlankerCommonConfig,
      ...defaultFlankerTestConfig,
      isLastTest: true,
    },
    responseType: ItemResponseType.Flanker,
    order: 13,
  }, //12 TestThird
];

export const getABTrailsItems = (deviceType: DeviceType) =>
  createArray(4, (index) => ({
    id: undefined,
    key: uuidv4(),
    responseType: ItemResponseType.ABTrails,
    name: `${ItemResponseType.ABTrails}_${deviceType}_${index + 1}`,
    question: ABTrailsItemQuestions[index],
    config: {
      deviceType,
      orderName: OrderName[ordinalStrings[index] as keyof typeof OrderName],
    },
  }));

export const getNewPerformanceTask = ({
  name,
  description,
  performanceTask,
  performanceTaskType,
}: GetNewPerformanceTask) => {
  const itemsByType = {
    [PerfTaskType.Flanker]: flankerItems,
    [PerfTaskType.Gyroscope]: getGyroscopeOrTouchItems(GyroscopeOrTouch.Gyroscope),
    [PerfTaskType.Touch]: getGyroscopeOrTouchItems(GyroscopeOrTouch.Touch),
    [PerfTaskType.ABTrailsMobile]: getABTrailsItems(DeviceType.Mobile),
    [PerfTaskType.ABTrailsTablet]: getABTrailsItems(DeviceType.Tablet),
  };

  const { items, ...restPerfTaskParams } = performanceTask || {};

  const getItems = (): ItemFormValues[] | PerformanceTaskItems => {
    if (items?.length) {
      return items.map((item) => ({
        ...item,
        id: undefined,
      }));
    }

    return performanceTaskType ? itemsByType[performanceTaskType] : [];
  };

  return {
    name,
    description,
    isHidden: false,
    items: getItems(),
    isPerformanceTask: true,
    performanceTaskType,
    ...restPerfTaskParams,
    id: undefined,
    key: uuidv4(),
  };
};

export const getNewApplet = () => ({
  displayName: '',
  description: '',
  themeId: '',
  about: '',
  image: '',
  watermark: '',
  activities: [],
  activityFlows: [],
  reportEmailBody: t('reportEmailBody'),
});

export const getNewActivityFlow = () => ({
  key: uuidv4(),
  name: '',
  description: '',
  isSingleReport: false,
  hideBadge: false,
  isHidden: false,
});

const getActivityItemResponseValues = (item: Item) => {
  switch (item.responseType) {
    case ItemResponseType.SingleSelection:
    case ItemResponseType.MultipleSelection:
      return {
        options: item.responseValues?.options?.map((option) => ({
          ...option,
          color: option.color ? ({ hex: option.color } as ColorResult) : undefined,
        })),
        paletteName: item.responseValues.paletteName ?? undefined,
      };
    case ItemResponseType.SliderRows:
    case ItemResponseType.Slider:
    case ItemResponseType.AudioPlayer:
    case ItemResponseType.Audio:
    case ItemResponseType.NumberSelection:
    case ItemResponseType.Drawing:
      return {
        ...item.responseValues,
        options: undefined,
      };
    case ItemResponseType.SingleSelectionPerRow:
    case ItemResponseType.MultipleSelectionPerRow:
      return item.responseValues;
    default:
      return null;
  }
};

const getAlerts = (item: Item): ItemAlert[] | undefined => {
  const { responseType, responseValues, config } = item;

  if (
    responseType === ItemResponseType.SingleSelection ||
    responseType === ItemResponseType.MultipleSelection
  ) {
    const options = responseValues.options;
    const optionsWithAlert = options?.filter(({ alert }) => typeof alert === 'string');

    if (!optionsWithAlert?.length) return [];

    return optionsWithAlert.map(({ id, alert }) => ({
      key: uuidv4(),
      value: id,
      alert,
    }));
  }

  if (responseType === ItemResponseType.Slider) {
    const { alerts } = responseValues || {};
    const isContinuous = get(config, ItemConfigurationSettings.IsContinuous);

    if (!alerts?.length) return [];

    return alerts.map(({ value, minValue, maxValue, alert }) => ({
      key: uuidv4(),
      ...(!isContinuous && { value }),
      ...(isContinuous && { minValue, maxValue }),
      alert,
    }));
  }

  if (responseType === ItemResponseType.SliderRows) {
    const { rows } = responseValues || {};

    return (
      rows?.flatMap(
        ({ id, alerts }) =>
          alerts?.map(({ value, alert }) => ({ key: uuidv4(), sliderId: id, value, alert })) ?? [],
      ) ?? []
    );
  }

  if (
    responseType === ItemResponseType.SingleSelectionPerRow ||
    responseType === ItemResponseType.MultipleSelectionPerRow
  ) {
    const { dataMatrix } = responseValues;

    return (
      dataMatrix?.reduce(
        (result: ItemAlert[], { rowId, options }) => [
          ...result,
          ...options.reduce((result: ItemAlert[], { alert, optionId }) => {
            if (typeof alert !== 'string') return result;

            return [...result, { key: uuidv4(), rowId, optionId, alert }];
          }, []),
        ],
        [],
      ) ?? []
    );
  }
};

const getActivityItems = (items: Item[]) =>
  items
    ? items.map(
        (item) =>
          ({
            id: item.id,
            key: item.key,
            name: item.name,
            question: getDictionaryText(item.question),
            responseType: item.responseType,
            responseValues: getActivityItemResponseValues(item),
            config: item.config,
            conditionalLogic: undefined,
            alerts: getAlerts(item),
            allowEdit: item.allowEdit,
            isHidden: item.isHidden,
            order: item.order,
          }) as ItemFormValues,
      )
    : [];

const getActivityFlows = (activityFlows: ActivityFlow[], activities: Activity[]) =>
  activityFlows.map(({ order, ...activityFlow }) => ({
    ...activityFlow,
    description: getDictionaryText(activityFlow.description),
    items: activityFlow.items?.map(({ id, activityId, activityKey, key }) => ({
      id,
      key,
      activityKey: activityKey || activityId || '',
    })),
    ...getEntityReportFields({
      reportActivity: activityFlow.reportIncludedActivityName ?? '',
      reportItem: activityFlow.reportIncludedItemName ?? '',
      activities,
      type: FlowReportFieldsPrepareType.NameToKey,
    }),
  }));

const getConditionPayload = (item: Item, condition: Condition) => {
  if (!CONDITION_TYPES_TO_HAVE_OPTION_ID.includes(condition.type as ConditionType))
    return condition.payload;

  const options = (item?.responseValues as SingleAndMultipleSelectItemResponseValues)?.options;
  const optionValue = options?.find(
    ({ value }) => `${value}` === `${(condition as OptionCondition).payload.optionValue}`,
  )?.id;

  return {
    optionValue,
  };
};

const getActivityConditionalLogic = (items: Item[]) =>
  items?.reduce((result: ConditionalLogic[], item) => {
    if (item.conditionalLogic)
      return [
        ...result,
        {
          key: uuidv4(),
          itemKey: getEntityKey(item),
          match: item.conditionalLogic.match,
          conditions: item.conditionalLogic.conditions?.map((condition) => {
            const relatedItem = items.find((item) => item.name === condition.itemName);

            return {
              key: uuidv4(),
              type: condition.type,
              payload: getConditionPayload(relatedItem!, condition) as keyof Condition['payload'],
              itemName: getEntityKey(relatedItem ?? {}),
            };
          }),
        },
      ];

    return result;
  }, []);

const getScoreConditions = (items?: Item[], conditions?: Condition[], scoreName?: string) =>
  conditions?.map((condition) => {
    const { itemName, type } = condition;
    const relatedItem = items?.find((item) => item.name === itemName);
    const payload =
      type === ScoreConditionType
        ? { value: String((condition as ScoreCondition).payload?.value) }
        : (getConditionPayload(relatedItem!, condition) as keyof Condition['payload']);

    return {
      ...condition,
      payload,
      itemName: relatedItem ? getEntityKey(relatedItem) : scoreName ?? condition.itemName,
    };
  });

const getSectionConditions = ({ items, conditions, scores }: GetSectionConditions) =>
  conditions?.map((condition) => {
    const { itemName, type } = condition;
    const relatedItem = items?.find((item) => item.name === itemName);
    const relatedScore = findRelatedScore({ entityKey: itemName, scores });
    const payload =
      type === ScoreConditionType
        ? { value: String((condition as ScoreCondition).payload?.value) }
        : (getConditionPayload(relatedItem!, condition) as keyof Condition['payload']);

    return {
      ...condition,
      payload,
      itemName: relatedItem ? getEntityKey(relatedItem) : getEntityKey(relatedScore ?? {}, false),
    };
  });

const getShowMessageAndPrintItems = (message?: string, itemsPrint?: string[]) => ({
  showMessage: !!message?.length,
  printItems: !!itemsPrint?.length,
});

const remapItemsById = (itemsObject: Record<string, Item>) => (name: string) =>
  itemsObject[name].id;
const getScore = (
  score: ScoreReport,
  items: Activity['items'],
  itemsObject: Record<string, Item>,
) => {
  const scoreKey = uuidv4();
  const remapperFunction = remapItemsById(itemsObject);

  return {
    ...score,
    key: scoreKey,
    ...getShowMessageAndPrintItems(score.message, score.itemsPrint),
    conditionalLogic: score.conditionalLogic?.map((conditional) => ({
      ...conditional,
      key: uuidv4(),
      ...getShowMessageAndPrintItems(conditional.message, conditional.itemsPrint),
      conditions: getScoreConditions(items, conditional.conditions, scoreKey),
      itemsPrint: conditional.itemsPrint?.map(remapperFunction),
    })),
    itemsScore: score.itemsScore.map(remapperFunction),
    itemsPrint: score.itemsPrint?.map(remapperFunction),
  };
};

const getSection = (
  section: SectionReport,
  items: Activity['items'],
  scores: ScoreReport[],
  itemsObject: Record<string, Item>,
) => ({
  ...section,
  id: uuidv4(),
  ...getShowMessageAndPrintItems(section.message, section.itemsPrint),
  ...(!!Object.keys(section.conditionalLogic || {}).length && {
    conditionalLogic: {
      ...section.conditionalLogic,
      conditions: getSectionConditions({
        items,
        conditions: section?.conditionalLogic?.conditions,
        scores,
      }),
    },
  }),
  itemsPrint: section.itemsPrint?.map(remapItemsById(itemsObject)),
});

const getScoresAndReports = (activity: Activity) => {
  const { items, scoresAndReports } = activity;
  if (!scoresAndReports || !items) return;

  const itemsObject = getObjectFromList(items, (item) => item.name);
  const { reports: initialReports } = scoresAndReports;
  const reportsWithMappedScores = initialReports?.map((report) => {
    if (report.type === ScoreReportType.Section) return report;

    return getScore(report as ScoreReport, items, itemsObject);
  });
  const scores = reportsWithMappedScores?.filter((report) => report.type === ScoreReportType.Score);
  const reports = reportsWithMappedScores?.map((report) => {
    if (report.type === ScoreReportType.Score) return report;

    return getSection(report as SectionReport, items, scores as ScoreReport[], itemsObject);
  });

  return {
    ...scoresAndReports,
    reports,
  };
};

const getActivitySubscaleItems = ({
  activityItemsObject,
  subscalesObject,
  subscaleItems,
}: GetActivitySubscaleItems) =>
  subscaleItems.map(
    (item) =>
      getEntityKey(
        activityItemsObject[item.name]
          ? activityItemsObject[item.name]
          : subscalesObject[item.name],
      ) ?? '',
  );

const getActivitySubscaleSettingDuplicated = ({
  oldSubscaleSetting,
  newItemsObjectByOldId,
}: GetActivitySubscaleSettingDuplicated) => {
  if (!oldSubscaleSetting) return oldSubscaleSetting;

  return {
    ...oldSubscaleSetting,
    subscales: oldSubscaleSetting?.subscales?.map((subscale) => ({
      ...subscale,
      items: subscale.items.map(oldToNewIdRemapper(newItemsObjectByOldId)),
    })),
  };
};

const getActivitySubscaleSetting = (
  subscaleSetting: Activity['subscaleSetting'],
  activityItems: ItemFormValues[],
) => {
  if (!subscaleSetting) return subscaleSetting;

  const processedSubscaleSetting = {
    ...subscaleSetting,
    subscales: subscaleSetting?.subscales?.map((subscale) => ({
      ...subscale,
      id: uuidv4(),
    })),
  };
  const activityItemsObject = getObjectFromList(activityItems, (item) => item.name);
  const subscalesObject = getObjectFromList(
    processedSubscaleSetting.subscales,
    (subscale) => subscale.name,
  );

  return {
    ...processedSubscaleSetting,
    subscales: processedSubscaleSetting?.subscales?.map((subscale) => ({
      ...subscale,
      items: getActivitySubscaleItems({
        activityItemsObject,
        subscalesObject,
        subscaleItems: subscale.items,
      }),
    })),
  };
};

export const getDefaultValues = (appletData?: SingleApplet, defaultThemeId?: string) => {
  if (!appletData) return getNewApplet();

  const processedApplet: AppletFormValues = {
    ...appletData,
    description: getDictionaryText(appletData.description),
    about: getDictionaryText(appletData.about),
    themeId: appletData.themeId ?? defaultThemeId ?? '',
    activities: appletData.activities
      ? appletData.activities.map((activity) => {
          const items = getActivityItems(activity.items);

          return {
            ...activity,
            description: getDictionaryText(activity.description),
            items,
            ...getEntityReportFields({
              reportItem: activity.reportIncludedItemName,
              activityItems: activity.items,
              type: FlowReportFieldsPrepareType.NameToKey,
            }),
            conditionalLogic: getActivityConditionalLogic(activity.items),
            scoresAndReports: getScoresAndReports(activity),
            ...(activity.subscaleSetting && {
              subscaleSetting: getActivitySubscaleSetting(activity.subscaleSetting, items),
            }),
          } as ActivityFormValues;
        })
      : [],
    activityFlows: getActivityFlows(appletData.activityFlows, appletData.activities),
    streamEnabled: !!appletData.streamEnabled,
  };

  return processedApplet;
};

export const getAppletTabs = ({
  hasAboutAppletErrors,
  hasAppletActivitiesErrors,
  hasAppletActivityFlowErrors,
}: Record<string, boolean>) => [
  {
    labelKey: 'aboutApplet',
    id: 'builder-about-applet',
    icon: <Svg id="more-info-outlined" />,
    activeIcon: <Svg id="more-info-filled" />,
    path: Path.About,
    hasError: hasAboutAppletErrors,
    'data-testid': 'builder-tab-about-applet',
  },
  {
    labelKey: 'activities',
    id: 'builder-activities',
    icon: <Svg id="checklist-outlined" />,
    activeIcon: <Svg id="checklist-filled" />,
    path: Path.Activities,
    hasError: hasAppletActivitiesErrors,
    'data-testid': 'builder-tab-activities',
  },
  {
    labelKey: 'activityFlows',
    id: 'builder-activity-flows',
    icon: <Svg id="flow-outlined" />,
    activeIcon: <Svg id="flow-filled" />,
    path: Path.ActivityFlow,
    hasError: hasAppletActivityFlowErrors,
    'data-testid': 'builder-tab-activity-flows',
  },
  {
    labelKey: 'appletSettings',
    id: 'builder-settings',
    icon: <Svg id="settings" />,
    activeIcon: <Svg id="settings-filled" />,
    path: Path.Settings,
    'data-testid': 'builder-tab-settings',
  },
];

export const testIsReportCommonFieldsRequired = (
  isScoreReport: boolean,
  printItemsValue: boolean,
  context: unknown,
) => {
  if (isScoreReport) {
    const conditionalLogicLength = get(context, 'from.0.value.conditionalLogic')?.length;

    return !!conditionalLogicLength || printItemsValue;
  }

  return printItemsValue;
};

export const testFunctionForUniqueness = (value: string, items: { name: string }[]) =>
  items?.filter((item) => item.name === value).length < 2 ?? true;

export const testFunctionForSystemItems = (
  currentItem: ItemFormValues,
  items: ItemFormValues[],
) => {
  if (currentItem.allowEdit === false) return true;

  if (
    currentItem.name !== LookupTableItems.Age_screen &&
    currentItem.name !== LookupTableItems.Gender_screen
  )
    return true;

  return !items?.some((item) => isSystemItem(item));
};

export const testFunctionForTheSameVariable = (
  field: string,
  value: string,
  context: yup.TestContext,
) => {
  const itemName = get(context, 'parent.name');
  const variableNames = getTextBetweenBrackets(value);

  return !variableNames.includes(itemName);
};

export const testFunctionForNotSupportedItems = (value: string, context: yup.TestContext) => {
  const items: Item[] = get(context, 'from.1.value.items');
  const variableNames = getTextBetweenBrackets(value);
  const itemsFromVariables = items.filter((item) => variableNames.includes(item.name));

  return itemsFromVariables.every((item) => ALLOWED_TYPES_IN_VARIABLES.includes(item.responseType));
};

export const testFunctionForSkippedItems = (value: string, context: yup.TestContext) => {
  const items: Item[] = get(context, 'from.1.value.items');
  const variableNames = getTextBetweenBrackets(value);

  return !items.some((item) => variableNames.includes(item.name) && item.config.skippableItem);
};

export const testFunctionForNotExistedItems = (value: string, context: yup.TestContext) => {
  const items: Item[] = get(context, 'from.1.value.items');
  const variableNames = getTextBetweenBrackets(value);

  if (!variableNames.length) return true;

  return variableNames.every((variable) => items.some((item) => item.name === variable));
};

export const testFunctionForSubscaleAge = (field: string, value?: number | string | null) =>
  typeof value === 'number' || value ? +value > 0 : true;

export const checkScoreRegexp = /^-?\d+\.?\d{0,5}$/;
export const checkRawScoreRegexp = /^-?\d+$/;

export const getTestFunctionForSubscaleScore = (regexp: RegExp) => (value?: string) => {
  if (!value) return false;

  if (value.includes(INTERVAL_SYMBOL)) {
    const [leftValue, rightValue] = value.split(INTERVAL_SYMBOL).map((item) => item.trim());

    return regexp.test(leftValue) && regexp.test(rightValue);
  }

  return regexp.test(value);
};

export const prepareActivitiesFromLibrary = (activities: ActivityFormValues[]) =>
  activities.reduce(
    (result: ActivityFormValues[], activity) => [
      ...result,
      {
        ...activity,
        name: getUniqueName({ name: activity.name, existingNames: pluck(result, 'name') }),
      },
    ],
    [],
  );

export const prepareActivityFlowsFromLibrary = (activityFlows: ActivityFlowFormValues[]) =>
  activityFlows.reduce(
    (result: ActivityFlowFormValues[], activityFlow) => [
      ...result,
      {
        ...activityFlow,
        name: getUniqueName({ name: activityFlow.name, existingNames: pluck(result, 'name') }),
      },
    ],
    [],
  );

export const getRegexForIndexedField = (fieldName: string) =>
  new RegExp(`\\[(\\d+)\\].${fieldName}$`);

export const isNumberTest = (value?: unknown) => typeof value === 'number' || value === undefined;
export const isNumberAtLeastOne = (value?: unknown) =>
  typeof value === 'number' && value >= DEFAULT_MIN_NUMBER;

export const getCommonSliderValidationProps = (type: 'slider' | 'sliderRows') => {
  const isSlider = type === 'slider';
  const minNumber = isSlider ? DEFAULT_SLIDER_MIN_NUMBER : DEFAULT_SLIDER_ROWS_MIN_NUMBER;

  return {
    minValue: yup
      .mixed()
      .test('is-number', t('positiveIntegerRequired'), isNumberTest)
      .test('min-max-interval', t('selectValidInterval'), function (value) {
        if (!value && value !== 0) return;
        const { maxValue } = this.parent;

        return value < maxValue && value >= minNumber && value < DEFAULT_SLIDER_MAX_NUMBER;
      }),
    maxValue: yup
      .mixed()
      .test('is-number', t('positiveIntegerRequired'), isNumberTest)
      .test('min-max-interval', t('selectValidInterval'), function (value) {
        if (!value && value !== 0) return;
        const { minValue } = this.parent;

        return value > minValue && value > minNumber && value <= DEFAULT_SLIDER_MAX_NUMBER;
      }),
    ...(isSlider && {
      scores: yup
        .array()
        .of(
          yup
            .mixed()
            .test('is-number', t('numberValueIsRequired'), isNumberTest)
            .required(t('numberValueIsRequired')),
        )
        .nullable(),
    }),
  };
};

export const getSliderAlertValueValidation = (isContinuous: boolean) =>
  yup
    .mixed()
    .test('is-number', t('selectValueWithinInterval'), isNumberTest)
    .test('min-max-interval', t('selectValueWithinInterval'), function (value) {
      if (!value && value !== 0) return;
      const { minValue, maxValue } = this.from?.[1]?.value?.responseValues || {};
      const isWithinInterval = value >= minValue && value <= maxValue;

      if (!isContinuous) return isWithinInterval;

      const { minValue: minAlertValue, maxValue: maxAlertValue } = this.parent || {};

      return isWithinInterval && maxAlertValue > minAlertValue;
    });
