import { PreloadedState } from '@reduxjs/toolkit';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import { preloadedState } from 'modules/Dashboard/features/Applet/Schedule/CreateEventPopup/CreateEventPopup.test';
import * as renderWithProvidersUtils from 'shared/utils/renderWithProviders';
import { RootState } from 'redux/store';

import { Legend } from './Legend';
import { PreparedEvents } from '../Schedule.types';
import { ScheduleProvider } from '../ScheduleProvider';

const dataTestid = 'dashboard-calendar-schedule-legend';
const testUserId = 'test-user-id';

const legendEvents = {
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
} as unknown as PreparedEvents;

jest.mock('shared/components', () => ({
  ...jest.requireActual('shared/components'),
  Table: () => <div>table component</div>,
}));

describe('Legend', () => {
  const mockedAppletId = preloadedState.applet.applet.data.result.id;

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
    const mockedAxios = axios.create();
    const mockedActivityId = preloadedState.calendarEvents.createEventsData.data.find(
      ({ isAlwaysAvailable }) => !!isAlwaysAvailable,
    )?.activityOrFlowId;
    let mockRequest: jest.Mock;

    beforeEach(() => {
      mockRequest = vi.fn().mockReturnValue(new Promise((res) => res(null)));

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
      vi.spyOn(mockedAxios, 'delete').mockImplementation(mockRequest);
      const clearAllScheduledEventsButton = screen.getByTestId(`${dataTestid}-scheduled-0`);

      await userEvent.click(clearAllScheduledEventsButton);

      const submitBttn = screen.getByTestId(
        `${dataTestid}-clear-scheduled-events-popup-submit-button`,
      );

      await userEvent.click(submitBttn);

      expect(mockRequest).toBeCalledWith(`/applets/${mockedAppletId}/events`, expect.anything());
    });

    test('Creates events for the default schedule', async () => {
      vi.spyOn(mockedAxios, 'post').mockImplementation(mockRequest);
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

      expect(mockRequest).toBeCalledWith(
        `/applets/${mockedAppletId}/events`,
        expect.objectContaining({ activityId: mockedActivityId, respondentId: undefined }),
        expect.anything(),
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
    const mockedAxios = axios.create();
    const mockedActivityId = preloadedState.calendarEvents.createEventsData.data.find(
      ({ isAlwaysAvailable }) => !!isAlwaysAvailable,
    )?.activityOrFlowId;
    let mockRequest: jest.Mock;

    beforeEach(() => {
      mockRequest = vi.fn().mockReturnValue(new Promise((res) => res(null)));
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

    test('Should Clear all scheduled events for the default schedule', async () => {
      vi.spyOn(mockedAxios, 'delete').mockImplementation(mockRequest);
      const clearAllScheduledEventsButton = screen.getByTestId(`${dataTestid}-scheduled-0`);

      await userEvent.click(clearAllScheduledEventsButton);

      const submitBttn = screen.getByTestId(
        `${dataTestid}-clear-scheduled-events-popup-submit-button`,
      );

      await userEvent.click(submitBttn);

      expect(mockRequest).toBeCalledWith(
        `/applets/${mockedAppletId}/events/delete_individual/${testUserId}`,
        expect.anything(),
      );
    });

    test('Creates events for the individual schedule', async () => {
      vi.spyOn(mockedAxios, 'post').mockImplementation(mockRequest);
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

      expect(mockRequest).toBeCalledWith(
        `/applets/${mockedAppletId}/events`,
        expect.objectContaining({ activityId: mockedActivityId, respondentId: testUserId }),
        expect.anything(),
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
