import { Dispatch, SetStateAction } from 'react';

import { Svg } from 'shared/components';
import { ActivityFormValues } from 'modules/Builder/types';
import { page } from 'resources';
import { PerfTaskType } from 'shared/consts';

import {
  ActivityNames,
  EditablePerformanceTasksType,
  GetActivitiesActions,
} from './Activities.types';
import { numberRegex, withoutNumberRegex } from './Activities.const';

export const getActivityKey = (entity: ActivityFormValues): string => entity.key ?? entity.id ?? '';

export const getActions = ({
  isActivityHidden,
  onEdit,
  onDuplicate,
  onVisibilityChange,
  onRemove,
  isEditVisible,
}: GetActivitiesActions) => [
  ...(isEditVisible
    ? [
        {
          icon: <Svg id="edit" />,
          action: onEdit,
        },
      ]
    : []),
  {
    icon: <Svg id="duplicate" />,
    action: onDuplicate,
  },
  {
    icon: <Svg id={isActivityHidden ? 'visibility-off' : 'visibility-on'} />,
    action: onVisibilityChange,
    isStatic: isActivityHidden,
  },
  {
    icon: <Svg id="trash" />,
    action: onRemove,
  },
];

const performanceTaskPaths: Record<EditablePerformanceTasksType, string> = {
  [PerfTaskType.Flanker]: page.builderAppletFlanker,
  [PerfTaskType.Gyroscope]: page.builderAppletGyroscope,
  [PerfTaskType.Touch]: page.builderAppletTouch,
};

export const getPerformanceTaskPath = (performanceTask: EditablePerformanceTasksType) =>
  performanceTaskPaths[performanceTask];

export const getInitialActivityNames = (activities: ActivityFormValues[]) =>
  activities.reduce((acc: ActivityNames, activity) => {
    const match = activity.name.match(withoutNumberRegex);
    const matchNumber = activity.name.match(numberRegex);
    const number = matchNumber ? parseInt(matchNumber[1]) : 0;
    const extractedName = match ? match[1].trim() : activity.name;
    const matchedItem = acc.find((item) => item.name === extractedName);

    if (matchedItem) {
      matchedItem.sequenceNumbers.push(number);
    } else {
      acc.push({ name: extractedName, sequenceNumbers: [number ?? 0] });
    }

    return acc;
  }, []);

export const removeNameSequenceNumber = (
  activityName: string,
  activityNames: ActivityNames,
  setActivityNames: Dispatch<SetStateAction<ActivityNames>>,
) => {
  const extractedName = activityName.match(withoutNumberRegex)?.[1]?.trim() || activityName;
  const matchNumber = activityName.match(numberRegex);
  const numberToDelete = matchNumber ? parseInt(matchNumber[1]) : 0;
  const matchedActivityNameIndex = activityNames.findIndex(
    (activity) => activity.name === extractedName,
  );

  if (matchedActivityNameIndex !== -1) {
    const matchedActivityName = activityNames[matchedActivityNameIndex];
    const matchedActivityNameNumbers = matchedActivityName.sequenceNumbers;

    if (matchedActivityNameNumbers.length > 1) {
      const newSequenceNumbers = matchedActivityNameNumbers.filter(
        (number) => number !== numberToDelete,
      );

      const updatedActivityNames = [
        ...activityNames.slice(0, matchedActivityNameIndex),
        { ...matchedActivityName, sequenceNumbers: newSequenceNumbers },
        ...activityNames.slice(matchedActivityNameIndex + 1),
      ];

      setActivityNames(updatedActivityNames);
    } else {
      const updatedActivityNames = [
        ...activityNames.slice(0, matchedActivityNameIndex),
        ...activityNames.slice(matchedActivityNameIndex + 1),
      ];

      setActivityNames(updatedActivityNames);
    }
  }
};

export const getAddedActivityName = (
  activityName: string,
  activityNames: ActivityNames,
  setActivityNames: Dispatch<SetStateAction<ActivityNames>>,
) => {
  const existingName = activityNames?.find((item) => item.name === activityName);

  if (!existingName) {
    setActivityNames((prevState) => [...prevState, { name: activityName, sequenceNumbers: [0] }]);

    return activityName;
  }

  const maxNumber = existingName.sequenceNumbers.length
    ? Math.max(...existingName.sequenceNumbers)
    : 0;
  setActivityNames((prevState) =>
    prevState.map((element) => {
      if (element.name === activityName) {
        return {
          ...element,
          sequenceNumbers: [...element.sequenceNumbers, maxNumber + 1],
        };
      }

      return element;
    }),
  );

  return `${existingName.name} (${maxNumber + 1})`;
};

export const getDuplicatedActivityName = (
  activityName: string,
  activityNames: ActivityNames,
  setActivityNames: Dispatch<SetStateAction<ActivityNames>>,
) => {
  const name = activityName.match(withoutNumberRegex)?.[1]?.trim() || activityName;
  const existingName = activityNames.find((item) => item.name === name);

  if (!existingName) return name;

  const maxNumber = existingName.sequenceNumbers.length
    ? Math.max(...existingName.sequenceNumbers)
    : 0;
  setActivityNames((prevState) =>
    prevState.map((element) => {
      if (element.name === name) {
        return {
          ...element,
          sequenceNumbers: [...element.sequenceNumbers, maxNumber + 1],
        };
      }

      return element;
    }),
  );

  return `${name} (${maxNumber + 1})`;
};
