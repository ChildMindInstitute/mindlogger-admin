import { Activity, ActivityFlow, Event, SingleApplet } from 'modules/Dashboard/state';
import { PeriodicityAlways } from 'modules/Dashboard/api';
import { variables } from 'shared/styles';

import { AddEventsToCategories, LegendEvent, PreparedEvents } from './Schedule.types';

const getCount = (ids: string[], id: string) => ids.filter((item) => item === id).length;

const {
  blue,
  blue_alfa30: blueAlfa30,
  brown,
  brown_alfa30: brownAlfa30,
  gray,
  gray_alfa30: grayAlfa30,
  green,
  green_alfa30: greenAlfa30,
  orange,
  orange_alfa30: orangeAlfa30,
  pink,
  pink_alfa30: pinkAlfa30,
  yellow,
  yellow_alfa30: yellowAlfa30,
  purple,
  purple_alfa30: purpleAlfa30,
  red,
  red_alfa30: redAlfa30,
} = variables.palette;

const colorsArray = [
  [blue, blueAlfa30],
  [green, greenAlfa30],
  [orange, orangeAlfa30],
  [brown, brownAlfa30],
  [yellow, yellowAlfa30],
  [pink, pinkAlfa30],
  [gray, grayAlfa30],
  [red, redAlfa30],
  [purple, purpleAlfa30],
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
    events
      ?.filter((event) => event.periodicity.type !== PeriodicityAlways.Always)
      .map(({ activityId, flowId }) => activityId || flowId) || [];

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
