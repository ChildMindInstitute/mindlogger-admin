import { v4 as uuidv4 } from 'uuid';
import { NavigateFunction, generatePath } from 'react-router-dom';

import { page } from 'resources';
import {
  PublishedApplet,
  SelectedCartApplet,
  SelectedCombinedCartApplet,
} from 'modules/Library/state';
import { getSelectedItemsFromStorage } from 'modules/Library/utils';
import { SelectedItem } from 'modules/Library/features/Applet';
import { ItemResponseType, performanceTaskResponseTypes, PerfTaskType } from 'shared/consts';
import {
  Item,
  SingleAndMultipleSelectMatrix,
  SingleAndMultiSelectOption,
  SingleAndMultiSelectRowOption,
  SingleApplet,
} from 'shared/state';

export const getSearchIncludes = (value: string, searchValue: string) =>
  value.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1;

export const navigateToBuilder = (
  navigate: NavigateFunction,
  appletId: string,
  data: SingleApplet,
) => {
  navigate(generatePath(page.builderAppletAbout, { appletId }), {
    state: { isFromLibrary: true, data },
  });
};

export const getPerformanceTaskType = (responseType: ItemResponseType) => {
  let performanceTaskType;
  switch (responseType) {
    case ItemResponseType.Flanker:
      performanceTaskType = PerfTaskType.Flanker;
      break;
    case ItemResponseType.TouchPractice:
    case ItemResponseType.TouchTest:
      performanceTaskType = PerfTaskType.Touch;
      break;
    case ItemResponseType.ABTrails:
      performanceTaskType = PerfTaskType.ABTrailsMobile;
      break;
    case ItemResponseType.StabilityTracker:
      performanceTaskType = PerfTaskType.Gyroscope;
      break;
  }

  return performanceTaskType;
};

export const mapResponseValues = <
  T extends {
    dataMatrix?: SingleAndMultipleSelectMatrix[] | null;
    options: (SingleAndMultiSelectOption | SingleAndMultiSelectRowOption)[];
  },
>(
  responseValues: T,
): T => ({
  ...responseValues,
  ...(responseValues.dataMatrix
    ? {
        options: responseValues.options?.map((option, index) => ({
          ...option,
          id: option.id ?? responseValues.dataMatrix?.[0].options[index]?.optionId ?? uuidv4(),
        })),
      }
    : {
        options: responseValues.options?.map((option) => ({
          ...option,
          id: option.id ?? uuidv4(),
        })),
      }),
});

export const getSelectedAppletData = (
  applet: PublishedApplet,
  selectedItems: SelectedItem[],
): SelectedCartApplet | null => {
  const selectedActivityKeysSet = new Set(selectedItems?.map((item) => item.activityKey));
  const selectedItemNamesSet = new Set(selectedItems?.map((item) => item.itemNamePlusActivityName));

  const selectedActivities = applet.activities
    .filter((activity) => selectedActivityKeysSet.has(activity.key))
    .map((activity) => {
      let isPerformanceTask = false;
      let performanceTaskType: PerfTaskType | null = null;
      const filteredItemsNamesSet = new Set();
      const filteredItems = activity.items.reduce((acc: Item[], item) => {
        if (selectedItemNamesSet.has(`${item.name}-${activity.name}`)) {
          acc.push(item);
          filteredItemsNamesSet.add(item.name);
        }

        return acc;
      }, []);

      const items = filteredItems.map((item) => {
        const newItem = {
          ...item,
          key: uuidv4(),
        };

        if (performanceTaskResponseTypes.includes(item.responseType)) {
          isPerformanceTask = true;
          performanceTaskType = getPerformanceTaskType(item.responseType) || null;
        }

        //for security reasons there is no 'id' in responseValues.options for Single/Multi selection (+ per row)
        if (
          newItem.responseType === ItemResponseType.SingleSelection ||
          newItem.responseType === ItemResponseType.MultipleSelection ||
          newItem.responseType === ItemResponseType.SingleSelectionPerRow ||
          newItem.responseType === ItemResponseType.MultipleSelectionPerRow
        ) {
          newItem.responseValues = mapResponseValues(newItem.responseValues);
        }

        // per requirements if not all the items which are in conditional logic were selected, conditional logic
        // should be removed
        if (
          !item.conditionalLogic?.conditions?.every((condition) =>
            filteredItemsNamesSet.has(condition.itemName),
          )
        ) {
          newItem.conditionalLogic = undefined;
        }

        return newItem;
      });

      //per requirements if not all the items in activity were selected, scores & reports and subscales should be removed
      const hasSubscalesAndScores = filteredItems.length === activity.items.length;

      return {
        ...activity,
        isPerformanceTask,
        performanceTaskType: performanceTaskType || undefined,
        items,
        ...(!hasSubscalesAndScores && { subscaleSetting: undefined, scoresAndReports: undefined }),
      };
    });

  const selectedActivityFlows = applet.activityFlows
    .filter((flow) => flow.items.every((item) => selectedActivityKeysSet.has(item.activityKey)))
    .map((flow) => ({
      ...flow,
      key: uuidv4(),
      items: flow.items.map((item) => ({ ...item, key: uuidv4() })),
    }));

  const { id, keywords, version, activities, activityFlows, ...restApplet } = applet;

  return {
    ...restApplet,
    activities: selectedActivities,
    activityFlows: selectedActivityFlows,
  };
};

export const getAddToBuilderData = async (cartItems: PublishedApplet[] | null) => {
  const selectedItems = getSelectedItemsFromStorage();

  const preparedApplets =
    cartItems?.reduce((acc: SelectedCartApplet[], applet) => {
      const selectedData = selectedItems[applet.id];
      const appletData = getSelectedAppletData(applet, selectedData);

      if (appletData) {
        acc.push(appletData);
      }

      return acc;
    }, []) || [];

  let appletToBuilder;

  if (preparedApplets.length === 1) {
    appletToBuilder = preparedApplets[0];
  }
  if (preparedApplets.length > 1) {
    appletToBuilder = preparedApplets.reduce(
      (acc: SelectedCombinedCartApplet, applet) => {
        acc.themeId = null;
        acc.activities.push(...applet.activities);
        acc.activityFlows.push(...applet.activityFlows);

        return acc;
      },
      { activities: [], activityFlows: [] },
    );
  }

  return { appletToBuilder };
};
