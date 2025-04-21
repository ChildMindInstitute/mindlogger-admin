import { vi } from 'vitest';
// Now import everything else after the mocks
import { PreloadedState } from '@reduxjs/toolkit';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RootState } from 'redux/store';
import * as renderWithProvidersUtils from 'shared/utils/renderWithProviders';
import {
  createEventApi,
  deleteIndividualEventsApi,
  deleteScheduledEventsApi,
} from 'modules/Dashboard/api/api';

import { Legend } from './Legend';
import { PreparedEvents } from '../Schedule.types';
import { ScheduleProvider } from '../ScheduleProvider';

// Mock the API client module with simple mocks
vi.mock('shared/api/apiConfig', () => ({
  authApiClient: {
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock the specific API functions with simple mocks
vi.mock('modules/Dashboard/api/api', () => ({
  deleteScheduledEventsApi: vi.fn(),
  deleteIndividualEventsApi: vi.fn(),
  createEventApi: vi.fn(),
}));

// Mock shared components
vi.mock('shared/components', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    Table: () => <div>table component</div>,
  };
});

// Constants
const dataTestid = 'dashboard-calendar-schedule-legend';
const testUserId = 'test-user-id';
const mockEventId1 = '8a0a2abd-d8e2-4fb6-91bb-65aecfc5396a';
const mockEventId2 = '9a0a2abd-d8e2-4fb6-91bb-65aecfc5396b';
const mockAppletId = 'a341e3d7-0170-4894-8823-798c58456130';
const initialStateData = {};
const mockedCurrentWorkspace = {};

const legendEvents: PreparedEvents = {
  alwaysAvailableEvents: [
    {
      id: '147fb738-5f3d-432f-b686-d6919f445795',
      name: 'Activity 1',
      isFlow: false,
      colors: ['#0b6e99', '#0b6e99'],
    },
  ],
  scheduledEvents: [
    {
      id: '41dcd5f3-03c8-4aea-a3b0-3e493cff3dda',
      name: 'Activity 2',
      isFlow: false,
      count: 1,
      colors: ['#0f7b6c', 'rgba(15, 123, 108, 0.3)'],
    },
  ],
  deactivatedEvents: [],
  scheduleExportTableData: [
    {
      activityName: {
        value: 'Activity 1',
      },
      date: {
        value: '09 Apr 2024',
      },
      startTime: {
        value: '-',
      },
      endTime: {
        value: '-',
      },
      notificationTime: {
        value: '-',
      },
      frequency: {
        value: 'Always',
      },
    },
    {
      activityName: {
        value: 'Activity 2',
      },
      date: {
        value: '11 Apr 2024',
      },
      startTime: {
        value: '00:00',
      },
      endTime: {
        value: '23:59',
      },
      notificationTime: {
        value: '-',
      },
      frequency: {
        value: 'Weekly',
      },
    },
  ],
  scheduleExportCsv: [
    {
      activityName: 'Activity 1',
      date: '09 Apr 2024',
      startTime: '-',
      endTime: '-',
      notificationTime: '-',
      frequency: 'Always',
    },
    {
      activityName: 'Activity 2',
      date: '11 Apr 2024',
      startTime: '00:00',
      endTime: '23:59',
      notificationTime: '-',
      frequency: 'Weekly',
    },
  ],
};

export const preloadedState = {
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
  },
  calendarEvents: {
    alwaysAvailableVisible: { data: true },
    scheduledVisible: { data: true },
    createEventsData: {
      data: [
        {
          activityOrFlowId: '96d889e2-2264-4e76-8c60-744600e770fe',
          eventId: mockEventId1,
          activityOrFlowName: 'Mock Activity 1',
          periodicityType: 'WEEKLY',
          selectedDate: '2024-03-18',
          startDate: '2024-03-18',
          endDate: '2024-12-31',
          startTime: '10:00:00',
          endTime: '12:00:00',
          isAlwaysAvailable: false,
          colors: ['#0b6e99', 'rgba(11, 110, 153, 0.3)'],
          flowId: null,
          nextYearDateString: null,
          currentYear: 2024,
          oneTimeCompletion: null,
          accessBeforeSchedule: false,
          timerType: 'NOT_SET',
          timer: null,
          notification: null,
        },
        {
          activityOrFlowId: '60f83cbf-8ffe-447b-af34-0e4cc5f8d3d0',
          eventId: mockEventId2,
          activityOrFlowName: 'Mock Activity 2',
          periodicityType: 'ALWAYS',
          selectedDate: '2024-03-18',
          startDate: null,
          endDate: null,
          startTime: '00:00:00',
          endTime: '23:59:00',
          isAlwaysAvailable: true,
          colors: ['#0b6e99', 'rgba(11, 110, 153, 0.3)'],
          flowId: null,
          nextYearDateString: null,
          currentYear: 2024,
          oneTimeCompletion: false,
          accessBeforeSchedule: null,
          timerType: 'NOT_SET',
          timer: null,
          notification: null,
        },
      ],
    },
  },
  applet: {
    applet: {
      data: {
        result: {
          displayName: 'Mock Applet',
          description: 'Applet Description...',
          id: mockAppletId,
          version: '3.0.0',
          createdAt: '2024-02-13T18:10:20.530872',
          updatedAt: '2024-03-05T18:58:21.012829',
          activities: [
            {
              name: 'Mock Activity 1',
              description: 'Activity Description...',
              id: '96d889e2-2264-4e76-8c60-744600e770fe',
              createdAt: '2024-03-05T18:58:21.029663',
            },
            {
              name: 'Mock Activity 2',
              description: 'Activity Description...',
              id: '60f83cbf-8ffe-447b-af34-0e4cc5f8d3d0',
              createdAt: '2024-03-05T19:20:21.029663',
            },
          ],
        },
      },
    },
  },
};

describe('Legend', () => {
  const mockedAppletId = preloadedState.applet.applet.data.result.id;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renders the appropriate controls', () => {
    beforeEach(() => {
      renderWithProvidersUtils.renderWithProviders(<Legend legendEvents={legendEvents} />);
    });

    test("Should show the 'Import' button", async () => {
      const importButton = screen.getByTestId(`${dataTestid}-import`);
      expect(importButton).toBeInTheDocument();
      expect(importButton).toHaveTextContent('Import');

      await userEvent.click(importButton);

      expect(screen.getByTestId(`${dataTestid}-import-schedule-popup`)).toBeInTheDocument();
      const closeImportPopupButton = screen.getByTestId(
        `${dataTestid}-import-schedule-popup-close-button`,
      );
      expect(closeImportPopupButton).toBeInTheDocument();

      await userEvent.click(closeImportPopupButton);

      expect(screen.queryByTestId(`${dataTestid}-import-schedule-popup`)).not.toBeInTheDocument();
    });

    test("Should show the 'Export' button", async () => {
      const exportButton = screen.getByTestId(`${dataTestid}-export`);
      expect(exportButton).toBeInTheDocument();
      expect(exportButton).toHaveTextContent('Export');
    });
  });

  describe('When `showScheduleToggle` is false', () => {
    beforeEach(() => {
      renderWithProvidersUtils.renderWithProviders(
        <Legend legendEvents={legendEvents} showScheduleToggle={false} />,
      );
    });

    test('Should not show the schedule toggle', () => {
      const toggle = screen.queryByTestId(`${dataTestid}-schedule-toggle`);
      expect(toggle).not.toBeInTheDocument();
    });
  });

  describe('When `showScheduleToggle` is true', () => {
    test('Should show the schedule toggle', () => {
      renderWithProvidersUtils.renderWithProviders(
        <Legend legendEvents={legendEvents} showScheduleToggle />,
      );

      const toggle = screen.queryByTestId(`${dataTestid}-schedule-toggle`);
      expect(toggle).toBeInTheDocument();
    });

    describe('when `canCreateIndividualSchedule` is false', () => {
      test('The schedule toggle is disabled', () => {
        renderWithProvidersUtils.renderWithProviders(
          <ScheduleProvider
            appletId={mockedAppletId}
            appletName="Mock applet"
            data-testid={dataTestid}
          >
            <Legend legendEvents={legendEvents} showScheduleToggle />
          </ScheduleProvider>,
        );

        const toggle = screen.queryByTestId(`${dataTestid}-schedule-toggle`);
        expect(toggle).toBeInTheDocument();
        expect(toggle).toHaveAttribute('disabled');
      });
    });

    describe('when `canCreateIndividualSchedule` is true', () => {
      test('The schedule toggle is enabled', () => {
        renderWithProvidersUtils.renderWithProviders(
          <ScheduleProvider
            appletId={mockedAppletId}
            appletName="Mock applet"
            data-testid={dataTestid}
            userId={testUserId}
          >
            <Legend legendEvents={legendEvents} showScheduleToggle />
          </ScheduleProvider>,
        );

        const toggle = screen.queryByTestId(`${dataTestid}-schedule-toggle`);
        expect(toggle).toBeInTheDocument();
        expect(toggle).not.toHaveAttribute('disabled');
      });
    });
  });

  describe('When showing the default schedule ', () => {
    const mockedActivityId = preloadedState.calendarEvents.createEventsData.data.find(
      ({ isAlwaysAvailable }) => !!isAlwaysAvailable,
    )?.activityOrFlowId;

    beforeEach(() => {
      renderWithProvidersUtils.renderWithProviders(
        <ScheduleProvider
          appletId={mockedAppletId}
          appletName="Mock applet"
          data-testid={dataTestid}
          userId={testUserId}
        >
          <Legend legendEvents={legendEvents} showScheduleToggle />
        </ScheduleProvider>,
        { preloadedState } as { preloadedState: PreloadedState<RootState> },
      );
    });

    test('Should Clear all scheduled events for the default schedule', async () => {
      const clearAllScheduledEventsButton = screen.getByTestId(`${dataTestid}-scheduled-0`);

      await userEvent.click(clearAllScheduledEventsButton);

      const submitBttn = screen.getByTestId(
        `${dataTestid}-clear-scheduled-events-popup-submit-button`,
      );

      await userEvent.click(submitBttn);

      expect(deleteScheduledEventsApi).toHaveBeenCalledWith({ appletId: mockedAppletId });
    });

    test('Creates events for the default schedule', async () => {
      const triggrBttn = screen.getByTestId(`${dataTestid}-scheduled-item-0`)
        .firstChild as unknown as Element;

      await userEvent.click(triggrBttn);

      const muiInput = screen.getByTestId(`${dataTestid}-create-event-popup-form-activity`);
      const nativeInput = muiInput.querySelector('input') as unknown as Element;
      const submitBttn = screen.getByTestId(`${dataTestid}-create-event-popup-submit-button`);

      await fireEvent.change(nativeInput, { target: { value: mockedActivityId } });
      await userEvent.click(submitBttn);

      const confirmBttn = screen.getByTestId(
        'dashboard-calendar-confirm-scheduled-access-popup-submit-button',
      );

      await userEvent.click(confirmBttn);

      expect(createEventApi).toHaveBeenCalledWith(
        expect.objectContaining({
          appletId: mockedAppletId,
          body: expect.objectContaining({
            activityId: mockedActivityId,
            respondentId: undefined,
          }),
        }),
      );
    });

    test('Should show the correct header', () => {
      const schedule = screen.getByTestId(`${dataTestid}-schedule`);
      expect(schedule).toBeInTheDocument();
      expect(schedule).toHaveTextContent('Default Schedule');
    });

    test('The toggle opens the "Add individual schedule" dialog', async () => {
      const toggle = screen.getByTestId(`${dataTestid}-schedule-toggle`);
      await userEvent.click(toggle);
      const addDialog = screen.queryByTestId(`${dataTestid}-schedule-toggle-add-popup`);

      expect(addDialog).toBeInTheDocument();
    });

    test('The export button the "Export default schedule" dialog', async () => {
      const exportButton = screen.getByTestId(`${dataTestid}-export`);
      expect(exportButton).toBeInTheDocument();
      expect(exportButton).toHaveTextContent('Export');

      await userEvent.click(exportButton);

      expect(screen.getByTestId(`${dataTestid}-export-default-schedule-popup`)).toBeInTheDocument();
      const closeExportPopupButton = screen.getByTestId(
        `${dataTestid}-export-default-schedule-popup-close-button`,
      );
      expect(closeExportPopupButton).toBeInTheDocument();

      await userEvent.click(closeExportPopupButton);

      expect(
        screen.queryByTestId(`${dataTestid}-export-default-schedule-popup`),
      ).not.toBeInTheDocument();
    });
  });

  describe('When showing an individual schedule', () => {
    const mockedActivityId = preloadedState.calendarEvents.createEventsData.data.find(
      ({ isAlwaysAvailable }) => !!isAlwaysAvailable,
    )?.activityOrFlowId;

    beforeEach(() => {
      renderWithProvidersUtils.renderWithProviders(
        <ScheduleProvider
          appletId={mockedAppletId}
          appletName="Mock applet"
          canCreateIndividualSchedule
          data-testid={dataTestid}
          hasIndividualSchedule
          userId={testUserId}
        >
          <Legend legendEvents={legendEvents} showScheduleToggle />
        </ScheduleProvider>,
        { preloadedState } as { preloadedState: PreloadedState<RootState> },
      );
    });

    test('Should Clear all scheduled events for the individual schedule', async () => {
      const clearAllScheduledEventsButton = screen.getByTestId(`${dataTestid}-scheduled-0`);

      await userEvent.click(clearAllScheduledEventsButton);

      const submitBttn = screen.getByTestId(
        `${dataTestid}-clear-scheduled-events-popup-submit-button`,
      );

      await userEvent.click(submitBttn);

      expect(deleteIndividualEventsApi).toHaveBeenCalledWith({
        appletId: mockedAppletId,
        respondentId: testUserId,
      });
    });

    test('Creates events for the individual schedule', async () => {
      const triggrBttn = screen.getByTestId(`${dataTestid}-scheduled-item-0`)
        .firstChild as unknown as Element;

      await userEvent.click(triggrBttn);

      const muiInput = screen.getByTestId(`${dataTestid}-create-event-popup-form-activity`);
      const nativeInput = muiInput.querySelector('input') as unknown as Element;
      const submitBttn = screen.getByTestId(`${dataTestid}-create-event-popup-submit-button`);

      await fireEvent.change(nativeInput, { target: { value: mockedActivityId } });
      await userEvent.click(submitBttn);

      const confirmBttn = screen.getByTestId(
        'dashboard-calendar-confirm-scheduled-access-popup-submit-button',
      );

      await userEvent.click(confirmBttn);

      expect(createEventApi).toHaveBeenCalledWith(
        expect.objectContaining({
          appletId: mockedAppletId,
          body: expect.objectContaining({
            activityId: mockedActivityId,
            respondentId: testUserId,
          }),
        }),
      );
    });

    test('Should show the correct header', () => {
      const schedule = screen.getByTestId(`${dataTestid}-schedule`);
      expect(schedule).toBeInTheDocument();
      expect(schedule).toHaveTextContent('Individual Schedule');
    });

    test('The toggle opens the "Remove individual schedule" dialog', async () => {
      const toggle = screen.getByTestId(`${dataTestid}-schedule-toggle`);
      await userEvent.click(toggle);
      const addDialog = screen.queryByTestId(`${dataTestid}-schedule-toggle-remove-popup`);

      expect(addDialog).toBeInTheDocument();
    });

    test('The export button the "Export individual schedule" dialog', async () => {
      const exportButton = screen.getByTestId(`${dataTestid}-export`);
      expect(exportButton).toBeInTheDocument();
      expect(exportButton).toHaveTextContent('Export');

      await userEvent.click(exportButton);

      expect(
        screen.getByTestId(`${dataTestid}-export-individual-schedule-popup`),
      ).toBeInTheDocument();
      const closeExportPopupButton = screen.getByTestId(
        `${dataTestid}-export-individual-schedule-popup-close-button`,
      );
      expect(closeExportPopupButton).toBeInTheDocument();

      await userEvent.click(closeExportPopupButton);

      expect(
        screen.queryByTestId(`${dataTestid}-export-individual-schedule-popup`),
      ).not.toBeInTheDocument();
    });
  });
});
