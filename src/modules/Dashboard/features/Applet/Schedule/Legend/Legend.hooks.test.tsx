// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { renderHookWithProviders } from 'shared/utils';
import * as reduxHooks from 'redux/store/hooks';
import * as calendarEventsModule from 'modules/Dashboard/state/CalendarEvents';

import { useExpandedLists } from './Legend.hooks';

const mockedUseNavigate = jest.fn();
const mockedUseParams = jest.fn();
const mockedUseAppDispatch = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  useParams: () => mockedUseParams(),
}));

jest.mock('redux/store/hooks', () => ({
  ...jest.requireActual('redux/store/hooks'),
  useAppDispatch: () => mockedUseAppDispatch,
}));

jest.mock('modules/Dashboard/state/CalendarEvents', () => {
  const originalModule = jest.requireActual('modules/Dashboard/state/CalendarEvents');
  const useScheduledVisibilityData = jest.fn().mockReturnValue(true);
  const useAvailableVisibilityData = jest.fn().mockReturnValue(true);
  const setAvailableVisibility = jest.fn();
  const setScheduledVisibility = jest.fn();
  const createCalendarEvents = jest.fn();

  return {
    ...originalModule,
    calendarEvents: {
      ...originalModule.calendarEvents,
      useScheduledVisibilityData,
      useAvailableVisibilityData,
      actions: {
        ...originalModule.calendarEvents.actions,
        setAvailableVisibility,
        setScheduledVisibility,
        createCalendarEvents,
      },
    },
  };
});

describe('useExpandedLists', () => {
  test('returns correct data with legend events', () => {
    jest.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockedUseAppDispatch);
    mockedUseParams.mockReturnValue({ appletId: 'mockedAppletId' });
    const clearAllScheduledEventsAction = jest.fn();
    const onCreateActivitySchedule = jest.fn();

    const { result } = renderHookWithProviders(() =>
      useExpandedLists(
        {
          alwaysAvailableEvents: [
            { name: 'Event 1', id: '1', isFlow: true, colors: ['red'] },
            { name: 'Event 2', id: '2', isFlow: false, colors: ['green'] },
          ],
          scheduledEvents: [
            { name: 'Event 3', id: '3', isFlow: true, count: 5, colors: ['blue'] },
            { name: 'Event 4', id: '4', isFlow: false, count: 10, colors: ['yellow'] },
          ],
          deactivatedEvents: [
            { name: 'Event 5', id: '5', isFlow: true },
            { name: 'Event 6', id: '6', isFlow: false },
          ],
        },
        clearAllScheduledEventsAction,
        onCreateActivitySchedule,
      ),
    );

    const [scheduledList, availableList, deactivatedList] = result.current;

    // scheduled list
    expect(scheduledList.title).toBe('Scheduled');
    expect(scheduledList.items).toHaveLength(3);
    expect(scheduledList.buttons).toHaveLength(2);
    expect(scheduledList.type).toBe('scheduled');

    // always available list
    expect(availableList.title).toBe('Always available');
    expect(availableList.items).toHaveLength(2);
    expect(availableList.buttons).toHaveLength(1);
    expect(availableList.type).toBe('always-available');

    // deactivated list
    expect(deactivatedList.title).toBe('Deactivated');
    expect(deactivatedList.items).toHaveLength(2);
    expect(deactivatedList.buttons).toHaveLength(1);
    expect(deactivatedList.type).toBe('deactivated');

    // trigger actions
    scheduledList.buttons[0].action();
    expect(clearAllScheduledEventsAction).toHaveBeenCalled();
    scheduledList.buttons[1].action();
    const { setAvailableVisibility, setScheduledVisibility } =
      calendarEventsModule.calendarEvents.actions;
    expect(setScheduledVisibility).toHaveBeenCalledWith(true);

    availableList.buttons[0].action();
    expect(setAvailableVisibility).toHaveBeenCalledWith(true);

    deactivatedList.buttons[0].action();
    expect(mockedUseNavigate).toHaveBeenCalledWith('/builder/mockedAppletId/activities');
  });

  test('returns undefined when legend events are null', () => {
    mockedUseParams.mockReturnValue({ appletId: 'mockedAppletId' });
    const clearAllScheduledEventsAction = jest.fn();
    const onCreateActivitySchedule = jest.fn();

    const { result } = renderHookWithProviders(() =>
      useExpandedLists(null, clearAllScheduledEventsAction, onCreateActivitySchedule),
    );

    expect(result.current).toBe(undefined);
  });
});
