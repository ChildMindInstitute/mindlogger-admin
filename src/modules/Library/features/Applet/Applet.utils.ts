import { Dispatch, SetStateAction } from 'react';

import { PublishedActivity, PublishedApplet } from 'modules/Library/state';
import { ItemResponseType } from 'shared/consts';
import { SingleAndMultipleSelectItemResponseValues } from 'shared/state';

import { ExpandedActivity } from './Applet.types';

export const getUpdatedStorageData = (
  applets: PublishedApplet[] | null,
  selectedApplet: PublishedApplet,
  id: string,
) =>
  applets?.length
    ? [...applets.filter((applet) => applet.id !== id), selectedApplet]
    : [selectedApplet];

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

    const items = activity.items.map((item) => {
      let isItemExpanded = false;

      if (
        item.responseType === ItemResponseType.SingleSelection ||
        item.responseType === ItemResponseType.MultipleSelection
      ) {
        (item?.responseValues as SingleAndMultipleSelectItemResponseValues)?.options?.forEach(
          (option) => {
            if (includesSearchValue(option.text, search)) {
              isActivitiesExpanded = true;
              isItemExpanded = true;
              isActivityExpanded = true;
            }
          },
        );
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
