import { matchPath } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ColorResult } from 'react-color';
import get from 'lodash.get';

import i18n from 'i18n';
import { page } from 'resources';
import { Svg } from 'shared/components';
import {
  Item,
  Condition,
  SingleApplet,
  ActivityFlow,
  ConditionalLogic,
  DrawingResponseValues,
  NumberItemResponseValues,
  SliderItemResponseValues,
  SliderRowsResponseValues,
  AudioPlayerResponseValues,
  SingleAndMultipleSelectionOption,
  SingleAndMultipleSelectItemResponseValues,
  ItemAlert,
  SingleAndMultipleSelectRowsResponseValues,
  OptionCondition,
} from 'shared/state';
import { getDictionaryText, getEntityKey, Path } from 'shared/utils';
import {
  ConditionType,
  DEFAULT_LAMBDA_SLOPE,
  DEFAULT_LENGTH_OF_TEST,
  DEFAULT_MILLISECONDS_DURATION,
  DEFAULT_NUMBER_OF_TRIALS,
  DEFAULT_THRESHOLD_DURATION,
  ItemResponseType,
} from 'shared/consts';
import { ActivityFormValues, GetNewPerformanceTask, ItemFormValues } from 'modules/Builder/types';
import { ItemConfigurationSettings } from 'modules/Builder/features/ActivityItems/ItemConfiguration';
import { EditablePerformanceTasksType } from 'modules/Builder/features/Activities/Activities.types';

import { CONDITION_TYPES_TO_HAVE_OPTION_ID, defaultFlankerBtnObj } from './BuilderApplet.const';

const { t } = i18n;

export const isAppletRoute = (path: string) => matchPath(`${page.builderApplet}/*`, path);

export const getNewActivityItem = (item?: ItemFormValues) => ({
  responseType: '',
  name: t('newItem'),
  question: '',
  config: {},
  isHidden: false,
  allowEdit: true,
  ...item,
  id: undefined,
  key: uuidv4(),
  ...((item?.responseType === ItemResponseType.SingleSelection ||
    item?.responseType === ItemResponseType.MultipleSelection) && {
    responseValues: {
      ...item.responseValues,
      options: (item.responseValues as SingleAndMultipleSelectItemResponseValues)?.options?.map(
        (option: SingleAndMultipleSelectionOption) => ({
          ...option,
          id: uuidv4(),
        }),
      ),
    },
  }),
  ...(item?.responseType === ItemResponseType.Slider && {
    responseValues: {
      ...item.responseValues,
      id: uuidv4(),
    },
  }),
});

export const getDuplicatedConditions = (
  oldItems: ItemFormValues[],
  newItems: Record<string, unknown>[],
  conditions?: Condition[],
) =>
  conditions?.map((condition) => {
    const optionValue = (condition as OptionCondition)?.payload.optionValue;
    const result = { ...condition, key: uuidv4() };

    if (!optionValue) return result;

    const itemIndex = oldItems.findIndex((item) => condition.itemName === getEntityKey(item));
    const optionIndex = (
      oldItems[itemIndex]?.responseValues as SingleAndMultipleSelectItemResponseValues
    ).options?.findIndex((option) => option.id === optionValue);

    return {
      ...result,
      itemName: getEntityKey(newItems[itemIndex]) ?? '',
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

export const getNewActivity = (activity?: ActivityFormValues) => {
  const items = activity?.items?.map((item) => getNewActivityItem(item)) || [];
  const conditionalLogic = getDuplicatedConditional(
    activity?.items ?? [],
    items,
    activity?.conditionalLogic,
  );

  return {
    name: t('newActivity'),
    description: '',
    showAllAtOnce: false,
    isSkippable: false,
    isReviewable: false,
    responseIsEditable: true,
    ...activity,
    items,
    conditionalLogic,
    id: undefined,
    key: uuidv4(),
  };
};

export const getNewPerformanceTask = ({
  name,
  description,
  performanceTask,
  performanceTaskType,
}: GetNewPerformanceTask) => {
  const commonRoundProps = {
    stimulusDuration: DEFAULT_MILLISECONDS_DURATION,
    randomizeOrder: true,
    showSummary: true,
    blocks: [],
  };

  const defaultFlankerProps = {
    responseType: ItemResponseType.Flanker,
    name: ItemResponseType.Flanker,
    general: {
      instruction: t('performanceTaskInstructions.flankerGeneral'),
      buttons: [defaultFlankerBtnObj],
      fixation: null,
      stimulusTrials: [],
    },
    practice: {
      ...commonRoundProps,
      instruction: t('performanceTaskInstructions.flankerPractice'),
      threshold: DEFAULT_THRESHOLD_DURATION,
      showFeedback: true,
    },
    test: {
      ...commonRoundProps,
      instruction: t('performanceTaskInstructions.flankerTest'),
      showFeedback: false,
    },
  };
  const defaultGyroscopeAndTouchProps = {
    general: {
      instruction: t('gyroscopeAndTouchInstructions.overview.instruction'),
      numberOfTrials: DEFAULT_NUMBER_OF_TRIALS,
      lengthOfTest: DEFAULT_LENGTH_OF_TEST,
      lambdaSlope: DEFAULT_LAMBDA_SLOPE,
    },
    practice: {
      instruction: t('gyroscopeAndTouchInstructions.practice.instruction'),
    },
    test: {
      instruction: t('gyroscopeAndTouchInstructions.test.instruction'),
    },
  };

  const propsByTypeObj = {
    [EditablePerformanceTasksType.Flanker]: defaultFlankerProps,
    [EditablePerformanceTasksType.Gyroscope]: {
      responseType: ItemResponseType.Gyroscope,
      name: ItemResponseType.Gyroscope,
      ...defaultGyroscopeAndTouchProps,
    },
    [EditablePerformanceTasksType.Touch]: {
      responseType: ItemResponseType.Touch,
      name: ItemResponseType.Touch,
      ...defaultGyroscopeAndTouchProps,
    },
  };

  const defaultPropsByType = performanceTaskType
    ? propsByTypeObj[performanceTaskType as unknown as EditablePerformanceTasksType] || {
        responseType: '',
      }
    : { responseType: '' };

  const { responseType, ...config } = defaultPropsByType;

  return {
    name,
    description,
    isHidden: false,
    items: [
      {
        id: undefined,
        key: uuidv4(),
        name: `${responseType}`,
        responseType,
        config,
      },
    ],
    isPerformanceTask: true,
    performanceTaskType,
    ...performanceTask,
    id: undefined,
    key: uuidv4(),
  };
};

export const getNewApplet = () => ({
  displayName: '',
  description: '',
  themeId: 'default',
  about: '',
  image: '',
  watermark: '',
  activities: [],
  activityFlows: [],
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
        options: (item.responseValues as SingleAndMultipleSelectItemResponseValues)?.options?.map(
          (option) => ({
            ...option,
            color: option.color ? ({ hex: option.color } as ColorResult) : undefined,
          }),
        ),
        paletteName:
          (item.responseValues as SingleAndMultipleSelectItemResponseValues).paletteName ??
          undefined,
      };
    case ItemResponseType.SliderRows:
    case ItemResponseType.Slider:
    case ItemResponseType.AudioPlayer:
    case ItemResponseType.Audio:
    case ItemResponseType.NumberSelection:
    case ItemResponseType.Drawing:
      return {
        ...(item.responseValues as
          | SliderRowsResponseValues
          | SliderItemResponseValues
          | NumberItemResponseValues
          | DrawingResponseValues
          | AudioPlayerResponseValues),
        options: undefined,
      };
    case ItemResponseType.SingleSelectionPerRow:
    case ItemResponseType.MultipleSelectionPerRow:
      return item.responseValues;
    default:
      return null;
  }
};

const getAlerts = (item: Item) => {
  const { responseType, responseValues, config } = item;

  if (
    ~[ItemResponseType.SingleSelection, ItemResponseType.MultipleSelection].indexOf(responseType)
  ) {
    const options = (responseValues as SingleAndMultipleSelectItemResponseValues).options;
    const optionsWithAlert = options?.filter(({ alert }) => typeof alert === 'string');

    if (!optionsWithAlert?.length) return [];

    return optionsWithAlert.map(({ id, alert }) => ({
      key: uuidv4(),
      value: id,
      alert,
    }));
  }

  if (responseType === ItemResponseType.Slider) {
    const { alerts } = responseValues as SliderItemResponseValues;
    const isContinuous = get(config, ItemConfigurationSettings.IsContinuous);

    if (!alerts?.length) return [];

    return alerts.map(({ value, minValue, maxValue, alert }) => ({
      key: uuidv4(),
      ...(!isContinuous && { value: `${value}` }),
      ...(isContinuous && { minValue, maxValue }),
      alert,
    }));
  }

  if (responseType === ItemResponseType.SliderRows) {
    const { rows } = responseValues as SliderRowsResponseValues;

    return (
      rows?.flatMap(
        ({ id, alerts }) =>
          alerts?.map(({ value, alert }) => ({ key: uuidv4(), sliderId: id, value, alert })) ?? [],
      ) ?? []
    );
  }

  if (
    ~[ItemResponseType.SingleSelectionPerRow, ItemResponseType.MultipleSelectionPerRow].indexOf(
      responseType,
    )
  ) {
    const { dataMatrix } = responseValues as SingleAndMultipleSelectRowsResponseValues;

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
    ? items.map((item) => ({
        id: item.id ?? uuidv4(),
        name: item.name,
        question: getDictionaryText(item.question),
        responseType: item.responseType,
        responseValues: getActivityItemResponseValues(item),
        config: item.config,
        conditionalLogic: undefined,
        alerts: getAlerts(item),
        allowEdit: item.allowEdit,
      }))
    : [];

const getActivityFlows = (activityFlows: ActivityFlow[]) =>
  activityFlows.map(({ order, ...activityFlow }) => ({
    ...activityFlow,
    description: getDictionaryText(activityFlow.description),
    items: activityFlow.items?.map(({ id, activityId }) => ({
      id,
      activityKey: activityId || '',
    })),
  }));

const getConditionPayload = (item: Item, condition: Condition) => {
  if (!CONDITION_TYPES_TO_HAVE_OPTION_ID.includes(condition.type as ConditionType))
    return condition.payload;

  const options = (item?.responseValues as SingleAndMultipleSelectItemResponseValues).options;
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

export const getDefaultValues = (appletData?: SingleApplet) => {
  if (!appletData) return getNewApplet();

  return {
    ...appletData,
    description: getDictionaryText(appletData.description),
    about: getDictionaryText(appletData.about),
    themeId: appletData.themeId === null ? 'default' : appletData.themeId,
    activities: appletData.activities
      ? appletData.activities.map((activity) => ({
          ...activity,
          description: getDictionaryText(activity.description),
          items: getActivityItems(activity.items),
          //TODO: for frontend purposes - should be reviewed after refactoring phase
          conditionalLogic: getActivityConditionalLogic(activity.items),
        }))
      : [],
    activityFlows: getActivityFlows(appletData.activityFlows),
  };
};

export const getAppletTabs = ({
  hasAboutAppletErrors,
  hasAppletActivitiesErrors,
  hasAppletActivityFlowErrors,
}: Record<string, boolean>) => [
  {
    labelKey: 'aboutApplet',
    icon: <Svg id="more-info-outlined" />,
    activeIcon: <Svg id="more-info-filled" />,
    path: Path.About,
    hasError: hasAboutAppletErrors,
  },
  {
    labelKey: 'activities',
    icon: <Svg id="checklist-outlined" />,
    activeIcon: <Svg id="checklist-filled" />,
    path: Path.Activities,
    hasError: hasAppletActivitiesErrors,
  },
  {
    labelKey: 'activityFlow',
    icon: <Svg id="flow-outlined" />,
    activeIcon: <Svg id="flow-filled" />,
    path: Path.ActivityFlow,
    hasError: hasAppletActivityFlowErrors,
  },
  {
    labelKey: 'appletSettings',
    icon: <Svg id="settings" />,
    activeIcon: <Svg id="settings-filled" />,
    path: Path.Settings,
  },
];

//TODO: find a way to validate nested properties for objects in arrays for uniqueness
export const testFunctionForUniqueness = (field: string, value: string, context: unknown) => {
  const items = get(context, `from.1.value.${field}`);

  return items?.filter((item: { name: string }) => item.name === value).length < 2 ?? true;
};
