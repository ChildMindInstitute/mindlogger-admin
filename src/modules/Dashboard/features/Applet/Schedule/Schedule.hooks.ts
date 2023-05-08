import { useEffect, useRef } from 'react';
import { format, getYear } from 'date-fns';
import isEqual from 'lodash.isequal';

import { Activity, ActivityFlow, SingleApplet } from 'shared/state';
import { applets, CalendarEvent, calendarEvents, CreateEventsData } from 'modules/Dashboard/state';
import { Periodicity } from 'modules/Dashboard/api';
import { DateFormats } from 'shared/consts';
import { getTableCell } from 'shared/utils';
import { useAppDispatch } from 'redux/store';
import { createEvents } from 'modules/Dashboard/state/CalendarEvents/CalendarEvents.utils';

import { AddEventsToCategories, EventsData, LegendEvent, PreparedEvents } from './Schedule.types';
import {
  getNextColor,
  removeSecondsFromTime,
  getRepeatsAnswer,
  getFrequencyString,
  getCount,
} from './Schedule.utils';

export const usePreparedEvents = (appletData?: SingleApplet): PreparedEvents | null => {
  const dispatch = useAppDispatch();
  const { result: events } = applets.useEventsData() ?? {};
  const processedEventStartYear = calendarEvents.useProcessedEventStartYearData();
  const currentYear = getYear(new Date());
  const alwaysAvailableEvents: LegendEvent[] = [];
  const scheduledEvents: LegendEvent[] = [];
  const deactivatedEvents: LegendEvent[] = [];
  let eventsData: EventsData | undefined;
  const prevCalendarEventsArrRef = useRef<CalendarEvent[] | null>();
  const prevEventsDataArrRef = useRef<CreateEventsData[] | null>();

  if (appletData) {
    const { activities = [], activityFlows = [] } = appletData;
    const activitiesAndFlows = [...activities, ...activityFlows].map((item, index) => ({
      ...item,
      colors: getNextColor(index),
    }));

    if (events?.length) {
      eventsData = events?.reduce(
        (
          acc: EventsData,
          {
            periodicity,
            activityId,
            flowId,
            startTime: startTimeFull,
            endTime: endTimeFull,
            oneTimeCompletion,
            accessBeforeSchedule,
            timerType,
            timer,
            id: eventId,
            notification,
          },
        ) => {
          const activityOrFlowId = activityId || flowId || '';
          const currentActivityOrFlow = activitiesAndFlows.find(
            (item) => item.id === activityOrFlowId,
          );

          if (!currentActivityOrFlow?.isHidden) {
            const { type: periodicityType, selectedDate, startDate, endDate } = periodicity;
            const isAlwaysAvailable = periodicityType === Periodicity.Always;
            const selectedOrStartDate = selectedDate || startDate;
            const date = format(
              selectedOrStartDate ? new Date(selectedOrStartDate) : new Date(),
              DateFormats.DayMonthYear,
            );
            const startTime = isAlwaysAvailable ? '-' : removeSecondsFromTime(startTimeFull) || '';
            const endTime = isAlwaysAvailable ? '-' : removeSecondsFromTime(endTimeFull) || '';
            const activityOrFlowName = currentActivityOrFlow?.name || '';
            // TODO: Add notification time after notifications connection to the API
            const notificationTime = '-';
            const repeats = getRepeatsAnswer(periodicityType);
            const frequency = getFrequencyString(periodicityType);
            const activityOrFlowColors = currentActivityOrFlow?.colors || ['', ''];

            acc.scheduleExportTableData.push({
              activityName: getTableCell(activityOrFlowName),
              date: getTableCell(date),
              startTime: getTableCell(startTime),
              endTime: getTableCell(endTime),
              notificationTime: getTableCell(notificationTime),
              repeats: getTableCell(repeats),
              frequency: getTableCell(frequency),
            });

            acc.scheduleExportCsv.push({
              activityName: activityOrFlowName,
              date,
              startTime,
              endTime,
              notificationTime,
              repeats,
              frequency,
            });

            const dataToCreateEvent = {
              activityOrFlowId,
              eventId,
              activityOrFlowName,
              periodicityType,
              selectedDate,
              startDate,
              endDate,
              startTime: startTimeFull,
              endTime: endTimeFull,
              isAlwaysAvailable,
              colors: activityOrFlowColors,
              flowId,
              nextYearDateString: null,
              currentYear,
              oneTimeCompletion,
              accessBeforeSchedule,
              timerType,
              timer,
              notification,
            };

            if (dataToCreateEvent) {
              acc.eventsDataArr.push(dataToCreateEvent);
            }

            const calendarEvents = createEvents(dataToCreateEvent);

            if (calendarEvents) {
              acc.calendarEventsArr.push(...calendarEvents);
            }

            if (periodicityType === Periodicity.Always) {
              acc.alwaysActivitiesFlows.push({
                color: [activityOrFlowColors[0], activityOrFlowColors[0]],
                id: activityOrFlowId,
              });
            } else {
              acc.scheduledActivitiesFlows.push({
                color: activityOrFlowColors,
                id: activityOrFlowId,
              });
            }
          }

          return acc;
        },
        {
          scheduleExportTableData: [],
          scheduleExportCsv: [],
          scheduledActivitiesFlows: [],
          alwaysActivitiesFlows: [],
          calendarEventsArr: [],
          eventsDataArr: [],
        },
      );
    }

    const { scheduledActivitiesFlows = [], alwaysActivitiesFlows = [] } = eventsData ?? {};

    const addEventsToCategories = ({ id, name, isFlow, isHidden }: AddEventsToCategories) => {
      const event = { id, name, isFlow };
      if (isHidden) return deactivatedEvents.push(event);

      const scheduledActivityFlow = scheduledActivitiesFlows.find((item) => item.id === id);
      if (scheduledActivityFlow) {
        const colors = scheduledActivityFlow.color;

        return scheduledEvents.push({
          ...event,
          count: getCount(scheduledActivitiesFlows, id),
          colors,
        });
      }

      const alwaysActivityFlow = alwaysActivitiesFlows.find((flow) => flow.id === id);
      const colors = alwaysActivityFlow?.color || [];

      alwaysAvailableEvents.push({
        ...event,
        colors: [colors[0], colors[0]],
      });
    };

    activitiesAndFlows.forEach(
      ({
        id,
        name,
        isHidden,
        activityIds,
      }: ActivityFlow | (Activity & { activityIds?: string[] })) =>
        id && addEventsToCategories({ id, name, isFlow: !!activityIds, isHidden }),
    );
  }

  const {
    scheduleExportTableData = [],
    scheduleExportCsv = [],
    calendarEventsArr = [],
    eventsDataArr = [],
  } = eventsData ?? {};

  useEffect(() => {
    const conditionToCreateCalendarEvents =
      calendarEventsArr &&
      !isEqual(calendarEventsArr, prevCalendarEventsArrRef.current) &&
      (!processedEventStartYear || processedEventStartYear === currentYear);
    if (!conditionToCreateCalendarEvents) return;

    dispatch(calendarEvents.actions.createCalendarEvents({ events: calendarEventsArr }));
    prevCalendarEventsArrRef.current = calendarEventsArr;
  }, [calendarEventsArr]);

  useEffect(() => {
    (async () => {
      const conditionToCreateEventsData =
        eventsDataArr && !isEqual(eventsDataArr, prevEventsDataArrRef.current);
      if (!conditionToCreateEventsData) return;

      await dispatch(calendarEvents.actions.setCreateEventsData(eventsDataArr));
      prevEventsDataArrRef.current = eventsDataArr;

      if (processedEventStartYear && processedEventStartYear !== currentYear) {
        dispatch(
          calendarEvents.actions.createNextYearEvents({
            yearToCreateEvents: processedEventStartYear,
          }),
        );
      }
    })();
  }, [eventsDataArr]);

  return {
    alwaysAvailableEvents,
    scheduledEvents,
    deactivatedEvents,
    scheduleExportTableData,
    scheduleExportCsv,
  };
};
