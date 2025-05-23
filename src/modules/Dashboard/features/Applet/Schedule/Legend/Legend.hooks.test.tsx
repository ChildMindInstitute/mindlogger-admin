// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';
import * as reduxHooks from 'redux/store/hooks';
import * as calendarEventsModule from 'modules/Dashboard/state/CalendarEvents';

import { useExpandedLists } from './Legend.hooks';

const mockedUseNavigate = vi.fn();
const mockedUseParams = vi.fn();
const mockedUseAppDispatch = vi.fn();

// mock the module
vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockedUseNavigate,
    useParams: () => mockedUseParams,
  };
});

vi.mock('redux/store/hooks', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useAppDispatch: () => mockedUseAppDispatch,
  };
});

vi.mock('modules/Dashboard/state/CalendarEvents', async (importOriginal) => {
  const actual = await importOriginal();

  const useScheduledVisibilityData = vi.fn().mockReturnValue(true);
  const useAvailableVisibilityData = vi.fn().mockReturnValue(true);
  const setAvailableVisibility = vi.fn();
  const setScheduledVisibility = vi.fn();
  const createCalendarEvents = vi.fn();

  return {
    ...actual,
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
    vi.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockedUseAppDispatch);
    mockedUseParams.mockReturnValue({ appletId: 'mockedAppletId' });
    const clearAllScheduledEventsAction = vi.fn();
    const onCreateActivitySchedule = vi.fn();

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
    const clearAllScheduledEventsAction = vi.fn();
    const onCreateActivitySchedule = vi.fn();

    const { result } = renderHookWithProviders(() =>
      useExpandedLists(null, clearAllScheduledEventsAction, onCreateActivitySchedule),
    );

    expect(result.current).toBe(undefined);
  });
});
