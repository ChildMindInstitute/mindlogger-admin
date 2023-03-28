import { Activity, ActivityFlow, Event, SingleApplet } from 'modules/Dashboard/state';
import { variables } from 'shared/styles';
import { Periodicity } from 'modules/Dashboard/api';

import { AddEventsToCategories, LegendEvent, PreparedEvents } from './Schedule.types';

const getCount = (ids: string[], id: string) => ids.filter((item) => item === id).length;

/* eslint-disable camelcase */
const {
  blue,
  blue_alfa30,
  brown,
  brown_alfa30,
  gray,
  gray_alfa30,
  green,
  green_alfa30,
  orange,
  orange_alfa30,
  pink,
  pink_alfa30,
  yellow,
  yellow_alfa30,
  purple,
  purple_alfa30,
  red,
  red_alfa30,
} = variables.palette;

const colorsArray = [
  [blue, blue_alfa30],
  [green, green_alfa30],
  [orange, orange_alfa30],
  [brown, brown_alfa30],
  [yellow, yellow_alfa30],
  [pink, pink_alfa30],
  [gray, gray_alfa30],
  [red, red_alfa30],
  [purple, purple_alfa30],
];

const getNextColor = (index: number) => {
  const colorIndex = index % colorsArray.length;

  return colorsArray[colorIndex];
};

export const getPreparedEvents = (
  appletData?: SingleApplet,
  events?: Event[],
): PreparedEvents | null => {
  if (!appletData) return null;

  const { activities = [], activityFlows = [] } = appletData;

  const scheduledEventsIds =
    events?.reduce((acc: string[], { periodicity, activityId, flowId }) => {
      if (periodicity.type !== Periodicity.Always) {
        acc.push(activityId || flowId);
      }

      return acc;
    }, []) || [];

  const alwaysAvailableEvents: LegendEvent[] = [];
  const scheduledEvents: LegendEvent[] = [];
  const deactivatedEvents: LegendEvent[] = [];

  const addEventsToCategories = ({ id, name, isFlow, isHidden, index }: AddEventsToCategories) => {
    const colors = getNextColor(index);
    const event = { id, name, isFlow };
    if (isHidden) return deactivatedEvents.push(event);

    if (scheduledEventsIds.some((scheduledEventId) => scheduledEventId === id)) {
      return scheduledEvents.push({ ...event, count: getCount(scheduledEventsIds, id), colors });
    }
    alwaysAvailableEvents.push({ ...event, colors: [colors[0], colors[0]] });
  };

  [...activities, ...activityFlows].forEach(
    (
      { id, name, isHidden, activityIds }: ActivityFlow | (Activity & { activityIds?: string[] }),
      index,
    ) => addEventsToCategories({ id, name, isFlow: !!activityIds, isHidden, index }),
  );

  return { alwaysAvailableEvents, scheduledEvents, deactivatedEvents };
};
