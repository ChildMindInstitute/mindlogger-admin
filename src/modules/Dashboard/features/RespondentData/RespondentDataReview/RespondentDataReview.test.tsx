import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import mockAxios from 'jest-mock-axios';
import { FormProvider, useForm } from 'react-hook-form';

import * as dashboardHooks from 'modules/Dashboard/hooks';
import { page } from 'resources';
import { DateFormats, JEST_TEST_TIMEOUT, MAX_LIMIT } from 'shared/consts';
import {
  mockedActivityFlowId,
  mockedActivityId2,
  mockedAppletId,
  mockedFullSubjectId1,
} from 'shared/mock';
import {
  mockAssessment,
  mockDecryptedActivityData,
  mockedGetWithActivities2,
  mockedGetWithActivities3,
  mockedGetWithDates,
  mockedGetWithFlows1,
  mockedGetWithFlows2,
  mockedGetWithResponses,
  preloadedState,
} from 'shared/mock/RespondetDataReview.mock';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { RespondentDataReview } from './RespondentDataReview';

const date = new Date('2023-12-15');
const dataTestid = 'respondents-review';

const routeWithoutSelectedDate = `/dashboard/${mockedAppletId}/participants/${mockedFullSubjectId1}/activities/${mockedActivityId2}/responses`;

const activityRoute = `/dashboard/${mockedAppletId}/participants/${mockedFullSubjectId1}/activities/${mockedActivityId2}/responses?selectedDate=${format(
  date,
  DateFormats.YearMonthDay,
)}`;
const activityRoutePath = page.appletParticipantActivityDetailsDataReview;

const flowRoute1 = `/dashboard/${mockedAppletId}/participants/${mockedFullSubjectId1}/activityFlows/${mockedActivityFlowId}/responses?selectedDate=${format(
  date,
  DateFormats.YearMonthDay,
)}`;
const flowRoutePath = page.appletParticipantActivityDetailsFlowDataReview;

jest.mock('modules/Dashboard/hooks', () => ({
  ...jest.requireActual('modules/Dashboard/hooks'),
  useDecryptedActivityData: jest.fn(),
}));

jest.mock('modules/Dashboard/features/RespondentData/CollapsedMdText', () => ({
  __esModule: true,
  ...jest.requireActual('modules/Dashboard/features/RespondentData/CollapsedMdText'),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  CollapsedMdText: ({ text }) => <div data-testid="mock-collapsed-md-text">{text}</div>,
}));

const RespondentDataReviewWithForm = () => {
  const methods = useForm({
    defaultValues: {
      responseDate: null,
    },
  });

  return (
    <FormProvider {...methods}>
      <RespondentDataReview />
    </FormProvider>
  );
};

describe('RespondentDataReview', () => {
  describe('General component tests', () => {
    test('renders initial component with child components correctly', async () => {
      mockAxios.get
        .mockResolvedValueOnce(mockedGetWithDates)
        .mockResolvedValueOnce(mockedGetWithFlows1)
        .mockResolvedValueOnce(mockedGetWithActivities2);

      renderWithProviders(<RespondentDataReviewWithForm />, {
        preloadedState,
        route: activityRoute,
        routePath: activityRoutePath,
      });

      window.HTMLElement.prototype.scrollTo = () => {};

      await waitFor(() => {
        expect(mockAxios.get).toHaveBeenNthCalledWith(
          1,
          `/answers/applet/${mockedAppletId}/dates`,
          expect.objectContaining({
            params: {
              targetSubjectId: mockedFullSubjectId1,
              fromDate: startOfMonth(date).getTime().toString(),
              toDate: endOfMonth(date).getTime().toString(),
              activityOrFlowId: mockedActivityId2,
            },
          }),
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          2,
          `/answers/applet/${mockedAppletId}/review/flows`,
          {
            params: {
              createdDate: format(date, DateFormats.YearMonthDay),
              limit: MAX_LIMIT,
              targetSubjectId: mockedFullSubjectId1,
            },
            signal: undefined,
          },
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          3,
          `/answers/applet/${mockedAppletId}/review/activities`,
          {
            params: {
              createdDate: format(date, DateFormats.YearMonthDay),
              limit: MAX_LIMIT,
              targetSubjectId: mockedFullSubjectId1,
            },
            signal: undefined,
          },
        );
      });

      // Check render child components
      expect(screen.getByTestId(`${dataTestid}-menu`)).toBeInTheDocument();
      expect(screen.getByTestId(`${dataTestid}-container`)).toBeInTheDocument();
      expect(screen.getByTestId(`${dataTestid}-feedback-button`)).toBeInTheDocument();
      expect(
        screen.getByText(
          'Select the date, Activity Flow or Activity, and response time to review the response data.',
        ),
      ).toBeInTheDocument();
    });

    test('handles date picker interactions correctly', async () => {
      mockAxios.get
        .mockResolvedValueOnce(mockedGetWithDates)
        .mockResolvedValueOnce(mockedGetWithFlows1)
        .mockResolvedValueOnce(mockedGetWithActivities2);

      renderWithProviders(<RespondentDataReviewWithForm />, {
        preloadedState,
        route: activityRoute,
        routePath: activityRoutePath,
      });

      window.HTMLElement.prototype.scrollTo = () => {};

      await waitFor(() => {
        expect(mockAxios.get).toHaveBeenNthCalledWith(
          1,
          `/answers/applet/${mockedAppletId}/dates`,
          expect.objectContaining({
            params: {
              targetSubjectId: mockedFullSubjectId1,
              fromDate: startOfMonth(date).getTime().toString(),
              toDate: endOfMonth(date).getTime().toString(),
              activityOrFlowId: mockedActivityId2,
            },
          }),
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          2,
          `/answers/applet/${mockedAppletId}/review/flows`,
          {
            params: {
              createdDate: format(date, DateFormats.YearMonthDay),
              limit: MAX_LIMIT,
              targetSubjectId: mockedFullSubjectId1,
            },
            signal: undefined,
          },
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          3,
          `/answers/applet/${mockedAppletId}/review/activities`,
          {
            params: {
              createdDate: format(date, DateFormats.YearMonthDay),
              limit: MAX_LIMIT,
              targetSubjectId: mockedFullSubjectId1,
            },
            signal: undefined,
          },
        );
      });

      const inputContainer = screen.getByTestId(`${dataTestid}-menu-review-date`);
      expect(inputContainer).toBeInTheDocument();

      const input = inputContainer.querySelector('input') as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input.value).toEqual('15 Dec 2023');

      await act(async () => {
        await userEvent.click(inputContainer);
      });

      const datepicker = (await screen.findByTestId(
        `${dataTestid}-menu-review-date-popover`,
      )) as HTMLElement;
      expect(datepicker).toBeInTheDocument();

      const datepickerDaySelected = datepicker.getElementsByClassName(
        'react-datepicker__day react-datepicker__day--015',
      );
      expect(datepickerDaySelected).toHaveLength(1);

      await userEvent.click(datepickerDaySelected[0]);
      const okButton = screen.getByText('Ok');
      expect(okButton).toBeInTheDocument();
      await userEvent.click(okButton);

      await waitFor(() => {
        expect(input.value).toEqual('15 Dec 2023');
        expect(mockAxios.get).toHaveBeenCalledWith(
          `/answers/applet/${mockedAppletId}/review/flows`,
          expect.any(Object),
        );
        expect(mockAxios.get).toHaveBeenCalledWith(
          `/answers/applet/${mockedAppletId}/review/activities`,
          expect.any(Object),
        );
      });
    });

    test('handles activity selection and timestamps correctly', async () => {
      mockAxios.get
        .mockResolvedValueOnce(mockedGetWithDates)
        .mockResolvedValueOnce(mockedGetWithFlows1)
        .mockResolvedValueOnce(mockedGetWithActivities2)
        .mockResolvedValueOnce(mockedGetWithResponses)
        .mockResolvedValueOnce(mockAssessment);

      const getDecryptedActivityDataMock = jest.fn().mockReturnValue(mockDecryptedActivityData);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dashboardHooks.useDecryptedActivityData.mockReturnValue(getDecryptedActivityDataMock);

      renderWithProviders(<RespondentDataReviewWithForm />, {
        preloadedState,
        route: activityRoute,
        routePath: activityRoutePath,
      });

      window.HTMLElement.prototype.scrollTo = () => {};

      // Check activity selection
      const activityLength = await screen.findAllByTestId(
        /respondents-review-menu-activity-\d+-select$/,
      );
      expect(activityLength).toHaveLength(1);

      const activity = screen.getByTestId(`${dataTestid}-menu-activity-0-select`);
      await userEvent.click(activity);

      // Check timestamps after activity selection
      const timestampLength = screen.queryAllByTestId(
        /respondents-review-menu-activity-0-completion-time-\d+$/,
      );
      expect(timestampLength).toHaveLength(3);

      // Check inactive timestamp state
      const timestamp1 = screen.getByTestId(`${dataTestid}-menu-activity-0-completion-time-0`);
      expect(timestamp1).toHaveClass('MuiChip-colorSecondary');
      expect(timestamp1).toHaveTextContent('21:20:30');

      // Check active timestamp state
      const timestamp3 = screen.getByTestId(`${dataTestid}-menu-activity-0-completion-time-2`);
      expect(timestamp3).toHaveClass('MuiChip-colorPrimary');
      expect(timestamp3).toHaveTextContent('23:29:36');

      // Check timestamp interaction
      const timestamp0 = screen.getByTestId(`${dataTestid}-menu-activity-0-completion-time-0`);
      expect(timestamp0).toBeInTheDocument();
      await userEvent.click(timestamp0);

      await waitFor(() => {
        expect(mockAxios.get).toHaveBeenCalledWith(
          `/answers/applet/${mockedAppletId}/activities/${mockedActivityId2}/answers/answer-id-2-1`,
          expect.any(Object),
        );
        expect(mockAxios.get).toHaveBeenCalledWith(
          `/answers/applet/${mockedAppletId}/answers/answer-id-2-1/assessment`,
          expect.any(Object),
        );
      });

      // Check answer content
      expect(screen.getByTestId(`${dataTestid}-description`)).toBeInTheDocument();
      expect(screen.getByText('Single Selected - Mocked Item')).toBeInTheDocument();
    });

    test('handles feedback panel interactions correctly', async () => {
      mockAxios.get
        .mockResolvedValueOnce(mockedGetWithDates)
        .mockResolvedValueOnce(mockedGetWithFlows1)
        .mockResolvedValueOnce(mockedGetWithActivities2);

      renderWithProviders(<RespondentDataReviewWithForm />, {
        preloadedState,
        route: activityRoute,
        routePath: activityRoutePath,
      });

      window.HTMLElement.prototype.scrollTo = () => {};

      await waitFor(() => {
        expect(mockAxios.get).toHaveBeenNthCalledWith(
          1,
          `/answers/applet/${mockedAppletId}/dates`,
          expect.objectContaining({
            params: {
              targetSubjectId: mockedFullSubjectId1,
              fromDate: startOfMonth(date).getTime().toString(),
              toDate: endOfMonth(date).getTime().toString(),
              activityOrFlowId: mockedActivityId2,
            },
          }),
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          2,
          `/answers/applet/${mockedAppletId}/review/flows`,
          {
            params: {
              createdDate: format(date, DateFormats.YearMonthDay),
              limit: MAX_LIMIT,
              targetSubjectId: mockedFullSubjectId1,
            },
            signal: undefined,
          },
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          3,
          `/answers/applet/${mockedAppletId}/review/activities`,
          {
            params: {
              createdDate: format(date, DateFormats.YearMonthDay),
              limit: MAX_LIMIT,
              targetSubjectId: mockedFullSubjectId1,
            },
            signal: undefined,
          },
        );
      });

      const feedbackButton = screen.getByTestId(`${dataTestid}-feedback-button`);
      expect(feedbackButton).toBeInTheDocument();

      const feedbackMenu = screen.getByTestId(`${dataTestid}-feedback-menu`);
      expect(feedbackMenu).toBeInTheDocument();
      expect(feedbackMenu).toHaveStyle({ width: 0 });

      // Test opening feedback panel
      await userEvent.click(feedbackButton);
      expect(feedbackMenu).toHaveStyle({ width: '44rem' });

      // Test closing feedback panel
      const feedbackMenuClose = screen.getByTestId(`${dataTestid}-feedback-menu-close`);
      expect(feedbackMenuClose).toBeInTheDocument();
      await userEvent.click(feedbackMenuClose);
      expect(feedbackMenu).toHaveStyle({ width: 0 });

      // Verify feedback tab is not visible
      expect(
        screen.queryByTestId('respondents-data-summary-feedback-reviewed'),
      ).not.toBeInTheDocument();
    });

    test('renders component with chosen last answer date', async () => {
      mockAxios.get
        .mockResolvedValueOnce(mockedGetWithDates)
        .mockResolvedValueOnce(mockedGetWithFlows1)
        .mockResolvedValueOnce(mockedGetWithActivities2);

      renderWithProviders(<RespondentDataReviewWithForm />, {
        preloadedState,
        route: routeWithoutSelectedDate,
        routePath: activityRoutePath,
      });

      window.HTMLElement.prototype.scrollTo = () => {};

      await waitFor(() => {
        expect(mockAxios.get).toHaveBeenNthCalledWith(
          1,
          `/answers/applet/${mockedAppletId}/dates`,
          expect.objectContaining({
            params: {
              targetSubjectId: mockedFullSubjectId1,
              fromDate: startOfMonth(date).getTime().toString(),
              toDate: endOfMonth(date).getTime().toString(),
              activityOrFlowId: mockedActivityId2,
            },
          }),
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          2,
          `/answers/applet/${mockedAppletId}/review/flows`,
          {
            params: {
              createdDate: format(date, DateFormats.YearMonthDay),
              limit: MAX_LIMIT,
              targetSubjectId: mockedFullSubjectId1,
            },
            signal: undefined,
          },
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          3,
          `/answers/applet/${mockedAppletId}/review/activities`,
          {
            params: {
              createdDate: format(date, DateFormats.YearMonthDay),
              limit: MAX_LIMIT,
              targetSubjectId: mockedFullSubjectId1,
            },
            signal: undefined,
          },
        );

        const activityLength = screen.queryAllByTestId(
          /respondents-review-menu-activity-\d+-select$/,
        );
        expect(activityLength).toHaveLength(1);

        const timestampLength = screen.queryAllByTestId(
          /respondents-review-menu-activity-0-completion-time-\d+$/,
        );
        expect(timestampLength).toHaveLength(3);
      });

      //check inactive timestamp
      const timestamp1 = screen.getByTestId(`${dataTestid}-menu-activity-0-completion-time-0`);
      expect(timestamp1).toHaveClass('MuiChip-colorSecondary');
      expect(timestamp1).toHaveTextContent('21:20:30');

      //check active timestamp
      const timestamp3 = screen.getByTestId(`${dataTestid}-menu-activity-0-completion-time-2`);
      expect(timestamp3).toHaveClass('MuiChip-colorPrimary');
      expect(timestamp3).toHaveTextContent('23:29:36');
    });
  });

  describe('Activity view', () => {
    test('properly displays correct dates for selected activity', async () => {
      mockAxios.get
        .mockResolvedValueOnce(mockedGetWithDates)
        .mockResolvedValueOnce(mockedGetWithFlows1)
        .mockResolvedValueOnce(mockedGetWithActivities3);

      const getDecryptedActivityDataMock = jest.fn().mockReturnValue(mockDecryptedActivityData);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dashboardHooks.useDecryptedActivityData.mockReturnValue(getDecryptedActivityDataMock);

      renderWithProviders(<RespondentDataReviewWithForm />, {
        preloadedState,
        route: activityRoute,
        routePath: activityRoutePath,
      });

      window.HTMLElement.prototype.scrollTo = () => {};

      await waitFor(() => {
        expect(mockAxios.get).toHaveBeenNthCalledWith(
          1,
          `/answers/applet/${mockedAppletId}/dates`,
          expect.objectContaining({
            params: {
              targetSubjectId: mockedFullSubjectId1,
              fromDate: startOfMonth(date).getTime().toString(),
              toDate: endOfMonth(date).getTime().toString(),
              activityOrFlowId: mockedActivityId2,
            },
          }),
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          2,
          `/answers/applet/${mockedAppletId}/review/flows`,
          {
            params: {
              createdDate: format(date, DateFormats.YearMonthDay),
              limit: MAX_LIMIT,
              targetSubjectId: mockedFullSubjectId1,
            },
            signal: undefined,
          },
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          3,
          `/answers/applet/${mockedAppletId}/review/activities`,
          {
            params: {
              createdDate: format(date, DateFormats.YearMonthDay),
              limit: MAX_LIMIT,
              targetSubjectId: mockedFullSubjectId1,
            },
            signal: undefined,
          },
        );
      });

      expect(screen.getByTestId(`${dataTestid}-menu`)).toBeInTheDocument();
      expect(screen.getByTestId(`${dataTestid}-container`)).toBeInTheDocument();
      expect(screen.getByTestId(`${dataTestid}-feedback-button`)).toBeInTheDocument();

      const activityLength = screen.queryAllByTestId(
        /respondents-review-menu-activity-\d+-select$/,
      );
      expect(activityLength).toHaveLength(1);

      await waitFor(
        () => {
          expect(
            screen.getByTestId(`${dataTestid}-menu-activity-0-completion-time-0`),
          ).toBeInTheDocument();
        },
        { timeout: JEST_TEST_TIMEOUT },
      );

      // check that the correct amount of timestamps are in the selected activity
      const timestampLength = screen.queryAllByTestId(
        /respondents-review-menu-activity-0-completion-time-\d+$/,
      );
      expect(timestampLength).toHaveLength(3);

      const inputContainer = screen.getByTestId(`${dataTestid}-menu-review-date`);
      expect(inputContainer).toBeInTheDocument();

      const input = inputContainer.querySelector('input') as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input.value).toEqual('15 Dec 2023');
    });
  });

  describe('Activity flow view', () => {
    test('properly displays correct dates for selected activity flow', async () => {
      mockAxios.get
        .mockResolvedValueOnce(mockedGetWithDates)
        .mockResolvedValueOnce(mockedGetWithFlows2)
        .mockResolvedValueOnce(mockedGetWithActivities3);

      const getDecryptedActivityDataMock = jest.fn().mockReturnValue(mockDecryptedActivityData);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dashboardHooks.useDecryptedActivityData.mockReturnValue(getDecryptedActivityDataMock);

      renderWithProviders(<RespondentDataReviewWithForm />, {
        preloadedState,
        route: flowRoute1,
        routePath: flowRoutePath,
      });

      window.HTMLElement.prototype.scrollTo = () => {};

      await waitFor(() => {
        expect(mockAxios.get).toHaveBeenNthCalledWith(
          1,
          `/answers/applet/${mockedAppletId}/dates`,
          expect.objectContaining({
            params: {
              targetSubjectId: mockedFullSubjectId1,
              fromDate: startOfMonth(date).getTime().toString(),
              toDate: endOfMonth(date).getTime().toString(),
              activityOrFlowId: mockedActivityFlowId,
            },
          }),
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          2,
          `/answers/applet/${mockedAppletId}/review/flows`,
          {
            params: {
              createdDate: format(date, DateFormats.YearMonthDay),
              limit: MAX_LIMIT,
              targetSubjectId: mockedFullSubjectId1,
            },
            signal: undefined,
          },
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          3,
          `/answers/applet/${mockedAppletId}/review/activities`,
          {
            params: {
              createdDate: format(date, DateFormats.YearMonthDay),
              limit: MAX_LIMIT,
              targetSubjectId: mockedFullSubjectId1,
            },
            signal: undefined,
          },
        );
      });

      expect(screen.getByTestId(`${dataTestid}-menu`)).toBeInTheDocument();
      expect(screen.getByTestId(`${dataTestid}-container`)).toBeInTheDocument();
      expect(screen.getByTestId(`${dataTestid}-feedback-button`)).toBeInTheDocument();

      const activityLength = screen.queryAllByTestId(/respondents-review-menu-flow-\d+-select$/);
      expect(activityLength).toHaveLength(1);

      await waitFor(
        () => {
          expect(
            screen.getByTestId(`${dataTestid}-menu-flow-0-completion-time-0`),
          ).toBeInTheDocument();
        },
        { timeout: JEST_TEST_TIMEOUT },
      );

      // check that the correct amount of timestamps are in the selected activity
      const timestampLength = screen.queryAllByTestId(
        /respondents-review-menu-flow-0-completion-time-\d+$/,
      );
      expect(timestampLength).toHaveLength(2);

      const inputContainer = screen.getByTestId(`${dataTestid}-menu-review-date`);
      expect(inputContainer).toBeInTheDocument();

      const input = inputContainer.querySelector('input') as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input.value).toEqual('15 Dec 2023');
    });
  });
});
