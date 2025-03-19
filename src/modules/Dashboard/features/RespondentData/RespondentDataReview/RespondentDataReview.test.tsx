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
  mockedActivityId,
  mockedActivityId2,
  mockedAppletId,
  mockedFullSubjectId1,
} from 'shared/mock';
import {
  mockAssessment,
  mockDecryptedActivityData,
  mockedGetWithActivities1,
  mockedGetWithActivities2,
  mockedGetWithActivities3,
  mockedGetWithDates,
  mockedGetWithFlows1,
  mockedGetWithResponses,
  preloadedState,
} from 'shared/mock/RespondetDataReview.mock';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { RespondentDataReview } from './RespondentDataReview';

const date = new Date('2023-12-27');
const date2 = new Date('2023-12-15');
const dataTestid = 'respondents-review';

const route1 = `/dashboard/${mockedAppletId}/participants/${mockedFullSubjectId1}/dataviz/responses?selectedDate=${format(
  date,
  DateFormats.YearMonthDay,
)}`;
const route2 = `/dashboard/${mockedAppletId}/participants/${mockedFullSubjectId1}/dataviz/responses?selectedDate=${format(
  date2,
  DateFormats.YearMonthDay,
)}&answerId=answer-id-2-2&isFeedbackVisible=true`;
const routeWithoutSelectedDate = `/dashboard/${mockedAppletId}/participants/${mockedFullSubjectId1}/dataviz/responses`;
const routePath = page.appletParticipantDataReview;
const preloadedState: PreloadedState<RootState> = {
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
    roles: {
      ...initialStateData,
      data: {
        [mockedAppletId]: [Roles.Manager],
      },
    },
    workspacesRoles: initialStateData,
  },
  applet: {
    applet: {
      ...initialStateData,
      data: { result: mockedApplet },
    },
  },
  users: {
    allRespondents: {
      ...initialStateData,
      data: {
        result: [mockedFullParticipant1, mockedFullParticipant2],
        count: 2,
      },
    },
    subjectDetails: {
      ...initialStateData,
      data: {
        result: {
          id: '1',
          nickname: 'Mocked Respondent',
          secretUserId: mockedFullSubjectId1,
          lastSeen: '2023-12-15T23:29:36.150182',
          tag: 'Child' as ParticipantTag,
          userId: mockedFullSubjectId1,
          firstName: 'John',
          lastName: 'Doe',
          roles: [Roles.Respondent],
          teamMemberCanViewData: true,
        },
      },
    },
    respondentDetails: initialStateData,
  },
};

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
  test(
    'renders component correctly with all child components when isFeedbackVisible param is false',
    async () => {
      mockAxios.get.mockResolvedValueOnce(mockedGetWithFlows1);
      mockAxios.get.mockResolvedValueOnce(mockedGetWithActivities1);
      mockAxios.get.mockResolvedValueOnce(mockedGetWithDates);
      mockAxios.get.mockResolvedValueOnce(mockedGetWithFlows1);
      mockAxios.get.mockResolvedValueOnce(mockedGetWithActivities2);
      mockAxios.get.mockResolvedValueOnce(mockedGetWithResponses);
      mockAxios.get.mockResolvedValueOnce(mockAssessment);
      mockAxios.get.mockResolvedValueOnce(mockedGetWithResponses);
      mockAxios.get.mockResolvedValueOnce(mockAssessment);

      const getDecryptedActivityDataMock = jest.fn().mockReturnValue(mockDecryptedActivityData);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dashboardHooks.useDecryptedActivityData.mockReturnValue(getDecryptedActivityDataMock);

      renderWithProviders(<RespondentDataReviewWithForm />, {
        preloadedState,
        route: route1,
        routePath,
      });

      window.HTMLElement.prototype.scrollTo = () => {};

      await waitFor(() => {
        expect(mockAxios.get).toHaveBeenNthCalledWith(
          1,
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
          2,
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

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          3,
          `/answers/applet/${mockedAppletId}/dates`,
          expect.objectContaining({
            params: {
              targetSubjectId: mockedFullSubjectId1,
              fromDate: startOfMonth(date).getTime().toString(),
              toDate: endOfMonth(date).getTime().toString(),
            },
          }),
        );
      });

      // check render child components
      expect(screen.getByTestId(`${dataTestid}-menu`)).toBeInTheDocument();
      expect(screen.getByTestId(`${dataTestid}-container`)).toBeInTheDocument();
      expect(screen.getByTestId(`${dataTestid}-feedback-button`)).toBeInTheDocument();

      expect(
        screen.getByText(
          'Select the date, Activity Flow or Activity, and response time to review the response data.',
        ),
      ).toBeInTheDocument();

      // the activity list in the review menu child component is rendered correctly
      const activityLength = screen.queryAllByTestId(
        /respondents-review-menu-activity-\d+-select$/,
      );
      expect(activityLength).toHaveLength(1);

      const activity = screen.getByTestId(`${dataTestid}-menu-activity-0-select`);
      await userEvent.click(activity);

      // check that there are no timestamps in the selected activity
      const timestampLength = screen.queryAllByTestId(
        /respondents-review-menu-activity-0-completion-time-\d+$/,
      );
      expect(timestampLength).toHaveLength(0);

      // check that the selected date is displayed correctly in the datepicker
      const inputContainer = screen.getByTestId(`${dataTestid}-menu-review-date`);
      expect(inputContainer).toBeInTheDocument();

      const input = inputContainer.querySelector('input') as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input.value).toEqual('27 Dec 2023');

      await act(async () => {
        await userEvent.click(inputContainer);
      });

      const datepicker = (await screen.findByTestId(
        `${dataTestid}-menu-review-date-popover`,
      )) as HTMLElement;

      expect(datepicker).toBeInTheDocument();

      // open the datepicker and select a new date (Dec 15, 2023)
      const selectedDate = date2;
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

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          4,
          `/answers/applet/${mockedAppletId}/review/flows`,
          {
            params: {
              createdDate: format(selectedDate, DateFormats.YearMonthDay),
              limit: MAX_LIMIT,
              targetSubjectId: mockedFullSubjectId1,
            },
            signal: undefined,
          },
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          5,
          `/answers/applet/${mockedAppletId}/review/activities`,
          {
            params: {
              createdDate: format(selectedDate, DateFormats.YearMonthDay),
              limit: MAX_LIMIT,
              targetSubjectId: mockedFullSubjectId1,
            },
            signal: undefined,
          },
        );
        // get the answer with the latest completion date
        expect(mockAxios.get).toHaveBeenNthCalledWith(
          6,
          `/answers/applet/${mockedAppletId}/activities/${mockedActivityId}/answers/answer-id-1-2`,
          {
            params: {
              limit: MAX_LIMIT,
            },
            signal: undefined,
          },
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          7,
          `/answers/applet/${mockedAppletId}/answers/answer-id-1-2/assessment`,
          {
            signal: undefined,
          },
        );
      });

      // check that the Feedback Reviews tab is not open
      expect(
        screen.queryByTestId('respondents-data-summary-feedback-reviewed'),
      ).not.toBeInTheDocument();

      const timestampLength2 = screen.queryAllByTestId(
        /respondents-review-menu-activity-0-completion-time-\d+$/,
      );
      expect(timestampLength2).toHaveLength(2);

      const timestamp0 = screen.getByTestId(`${dataTestid}-menu-activity-0-completion-time-0`);
      expect(timestamp0).toBeInTheDocument();

      await userEvent.click(timestamp0);

      await waitFor(() => {
        expect(mockAxios.get).toHaveBeenNthCalledWith(
          8,
          `/answers/applet/${mockedAppletId}/activities/${mockedActivityId}/answers/answer-id-1-1`,
          {
            params: {
              limit: MAX_LIMIT,
            },
            signal: undefined,
          },
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          9,
          `/answers/applet/${mockedAppletId}/answers/answer-id-1-1/assessment`,
          {
            signal: undefined,
          },
        );
      });

      // check answer summary render
      expect(screen.getByTestId(`${dataTestid}-description`)).toBeInTheDocument();

      // check question render
      expect(screen.getByText('Single Selected - Mocked Item')).toBeInTheDocument();

      // test open/close feedback panel
      const feedbackButton = screen.getByTestId(`${dataTestid}-feedback-button`);
      expect(feedbackButton).toBeInTheDocument();

      const feedbackMenu = screen.getByTestId(`${dataTestid}-feedback-menu`);
      expect(feedbackMenu).toBeInTheDocument();
      expect(feedbackMenu).toHaveStyle({ width: 0 });

      await userEvent.click(feedbackButton);

      expect(feedbackMenu).toHaveStyle({
        width: '44rem',
      });

      const feedbackMenuClose = screen.getByTestId(`${dataTestid}-feedback-menu-close`);
      expect(feedbackMenuClose).toBeInTheDocument();

      await userEvent.click(feedbackMenuClose);

      expect(feedbackMenu).toHaveStyle({ width: 0 });
    },
    JEST_TEST_TIMEOUT,
  );

  test(
    'renders component correctly with all child components when isFeedbackVisible param is true',
    async () => {
      mockAxios.get.mockResolvedValueOnce(mockedGetWithFlows1);
      mockAxios.get.mockResolvedValueOnce(mockedGetWithActivities3);
      mockAxios.get.mockResolvedValueOnce(mockedGetWithDates);
      mockAxios.get.mockResolvedValueOnce(mockedGetWithResponses);
      mockAxios.get.mockResolvedValueOnce({
        data: {
          result: {},
        },
      });

      const getDecryptedActivityDataMock = jest.fn().mockReturnValue(mockDecryptedActivityData);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dashboardHooks.useDecryptedActivityData.mockReturnValue(getDecryptedActivityDataMock);

      renderWithProviders(<RespondentDataReviewWithForm />, {
        preloadedState,
        route: route2,
        routePath,
      });

      window.HTMLElement.prototype.scrollTo = () => {};

      await waitFor(() => {
        expect(mockAxios.get).toHaveBeenNthCalledWith(
          1,
          `/answers/applet/${mockedAppletId}/review/flows`,
          {
            params: {
              createdDate: '2023-12-15',
              limit: MAX_LIMIT,
              targetSubjectId: mockedFullSubjectId1,
            },
            signal: undefined,
          },
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          2,
          `/answers/applet/${mockedAppletId}/review/activities`,
          {
            params: {
              createdDate: '2023-12-15',
              limit: MAX_LIMIT,
              targetSubjectId: mockedFullSubjectId1,
            },
            signal: undefined,
          },
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          3,
          `/answers/applet/${mockedAppletId}/dates`,
          expect.objectContaining({
            params: {
              targetSubjectId: mockedFullSubjectId1,
              fromDate: startOfMonth(date).getTime().toString(),
              toDate: endOfMonth(date).getTime().toString(),
            },
          }),
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          4,
          `/answers/applet/${mockedAppletId}/activities/${mockedActivityId2}/answers/answer-id-2-2`,
          {
            params: {
              limit: MAX_LIMIT,
            },
            signal: undefined,
          },
        );
      });

      expect(mockAxios.get).toHaveBeenNthCalledWith(
        5,
        `/answers/applet/${mockedAppletId}/answers/answer-id-2-2/assessment`,
        {
          signal: undefined,
        },
      );

      // check that the Feedback Reviews tab is open
      expect(screen.getByTestId('respondents-data-summary-feedback-reviewed')).toBeInTheDocument();
    },
    JEST_TEST_TIMEOUT,
  );

  test('renders component with chosen last answer date', async () => {
    mockAxios.get.mockResolvedValueOnce(mockedGetWithFlows1);
    mockAxios.get.mockResolvedValueOnce(mockedGetWithActivities3);

    renderWithProviders(<RespondentDataReviewWithForm />, {
      preloadedState,
      route: routeWithoutSelectedDate,
      routePath,
    });

    window.HTMLElement.prototype.scrollTo = () => {};

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenNthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/review/flows`,
        {
          params: {
            createdDate: format(new Date('2023-12-15'), DateFormats.YearMonthDay),
            limit: MAX_LIMIT,
            targetSubjectId: mockedFullSubjectId1,
          },
          signal: undefined,
        },
      );

      expect(mockAxios.get).toHaveBeenNthCalledWith(
        2,
        `/answers/applet/${mockedAppletId}/review/activities`,
        {
          params: {
            createdDate: format(new Date('2023-12-15'), DateFormats.YearMonthDay),
            limit: MAX_LIMIT,
            targetSubjectId: mockedFullSubjectId1,
          },
          signal: undefined,
        },
      );

      const activityLength = screen.queryAllByTestId(
        /respondents-review-menu-activity-\d+-select$/,
      );
      expect(activityLength).toHaveLength(3);

      const timestampLength = screen.queryAllByTestId(
        /respondents-review-menu-activity-1-completion-time-\d+$/,
      );
      expect(timestampLength).toHaveLength(3);

      //check inactive timestamp
      const timestamp1 = screen.getByTestId(`${dataTestid}-menu-activity-1-completion-time-0`);
      expect(timestamp1).toHaveClass('MuiChip-colorSecondary');
      expect(timestamp1).toHaveTextContent('21:20:30');

      //check active timestamp
      const timestamp3 = screen.getByTestId(`${dataTestid}-menu-activity-1-completion-time-2`);
      expect(timestamp3).toHaveClass('MuiChip-colorPrimary');
      expect(timestamp3).toHaveTextContent('23:29:36');
    });
  });

  test('test if default review date is equal to last activity completed date', async () => {
    renderWithProviders(<RespondentDataReviewWithForm />, {
      preloadedState,
      route: routeWithoutSelectedDate,
      routePath,
    });

    const inputContainer = await screen.findByTestId(`${dataTestid}-menu-review-date`);
    expect(inputContainer).toBeInTheDocument();

    const input = inputContainer.querySelector('input') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toEqual('15 Dec 2023');
  });
});
