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
} from 'shared/state';
import { getDictionaryText, getEntityKey, Path } from 'shared/utils';
import { ItemResponseType } from 'shared/consts';
import { PerformanceTasks } from 'modules/Builder/features/Activities/Activities.types';

import { ActivityFormValues, GetNewPerformanceTask, ItemFormValues } from './BuilderApplet.types';

const { t } = i18n;

export const isAppletRoute = (path: string) => matchPath(`${page.builderApplet}/*`, path);

export const getNewActivityItem = (item?: ItemFormValues) => ({
  responseType: '',
  name: '',
  question: '',
  config: {},
  isHidden: false,
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

export const getNewActivity = (activity?: ActivityFormValues) => ({
  name: t('newActivity'),
  description: '',
  showAllAtOnce: false,
  isSkippable: false,
  isReviewable: false,
  responseIsEditable: true,
  generateReport: false,
  showScoreSummary: false,
  ...activity,
  items: activity?.items?.map((item) => getNewActivityItem(item)) || [],
  id: undefined,
  key: uuidv4(),
});

export const getNewPerformanceTask = ({
  name,
  description,
  performanceTask,
}: GetNewPerformanceTask) => ({
  name,
  description,
  isPerformanceTask: true,
  isFlankerItem: name === PerformanceTasks.Flanker,
  ...performanceTask,
  id: undefined,
  key: uuidv4(),
});

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

const getActivityItems = (items: Item[]) =>
  items
    ? items.map((item) => ({
        id: uuidv4(),
        name: item.name,
        question: getDictionaryText(item.question),
        responseType: item.responseType,
        responseValues: getActivityItemResponseValues(item),
        config: item.config,
        alerts: item.alerts ?? [],
        conditionalLogic: undefined,
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

const getActivityConditionalLogic = (items: Item[]) =>
  items?.reduce((result: ConditionalLogic[], item) => {
    if (item.conditionalLogic)
      return [
        ...result,
        {
          key: uuidv4(),
          itemKey: getEntityKey(item),
          match: item.conditionalLogic.match,
          conditions: item.conditionalLogic.conditions?.map(({ itemName, type, payload }) => ({
            type,
            payload: payload as keyof Condition['payload'],
            itemName: getEntityKey(items.find((item) => item.name === itemName) ?? {}),
          })),
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
