import { Dispatch, SetStateAction } from 'react';

import { PublishedActivity, PublishedApplet } from 'modules/Library/state';
import { Item } from 'redux/modules';
import { ItemResponseType, performanceTaskResponseTypes } from 'shared/consts';

import { ExpandedActivity } from './Applet.types';

export const checkIfPerformanceTask = (items: Item[]) =>
  items?.some(({ responseType }) => performanceTaskResponseTypes.includes(responseType));

export const getUpdatedStorageData = (
  applets: PublishedApplet[] | null,
  selectedApplet: PublishedApplet,
  id: string,
) => (applets?.length ? [...applets.filter((applet) => applet.id !== id), selectedApplet] : [selectedApplet]);

export const includesSearchValue = (text: string, search: string) => {
  const pattern = new RegExp(search, 'gi');

  return pattern.test(text);
};

export const getActivities = (
  activities: PublishedActivity[],
  search: string,
  setActivitiesVisible: Dispatch<SetStateAction<boolean>>,
) => {
  let isActivitiesExpanded = false;
  const updatedActivities = activities.reduce((acc: ExpandedActivity[], activity) => {
    let isActivityExpanded = false;

    if (includesSearchValue(activity.name, search)) {
      isActivitiesExpanded = true;
    }

    const isPerformanceTask = checkIfPerformanceTask(activity.items);
    if (isPerformanceTask) {
      acc.push({
        ...activity,
        expanded: isActivityExpanded,
      });

      return acc;
    }

    const items = activity.items.map((item) => {
      let isItemExpanded = false;

      if (
        item.responseType === ItemResponseType.SingleSelection ||
        item.responseType === ItemResponseType.MultipleSelection
      ) {
        item?.responseValues?.options?.forEach((option) => {
          if (includesSearchValue(option.text, search)) {
            isActivitiesExpanded = true;
            isItemExpanded = true;
            isActivityExpanded = true;
          }
        });
      }

      if (includesSearchValue(item.question.en, search)) {
        isActivitiesExpanded = true;
        isActivityExpanded = true;
      }

      return { ...item, expanded: isItemExpanded };
    });

    acc.push({
      ...activity,
      expanded: isActivityExpanded,
      items,
    });

    return acc;
  }, []);

  setActivitiesVisible(isActivitiesExpanded);

  return updatedActivities;
};
