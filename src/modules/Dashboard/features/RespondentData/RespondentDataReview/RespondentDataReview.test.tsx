import { waitFor, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import mockAxios from 'jest-mock-axios';
import { FormProvider, useForm } from 'react-hook-form';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import {
  mockedApplet,
  mockedAppletId,
  mockedCurrentWorkspace,
  mockedRespondent,
  mockedRespondent2,
  mockedRespondentId,
} from 'shared/mock';
import { DateFormats, Roles, JEST_TEST_TIMEOUT } from 'shared/consts';
import { initialStateData } from 'shared/state';
import { page } from 'resources';
import * as dashboardHooks from 'modules/Dashboard/hooks';

import { RespondentDataReview } from './RespondentDataReview';

const date = new Date('2023-12-27');
const dataTestid = 'respondents-review';

const route1 = `/dashboard/${mockedAppletId}/respondents/${mockedRespondentId}/dataviz/responses?selectedDate=2023-12-27`;
const route2 = `/dashboard/${mockedAppletId}/respondents/${mockedRespondentId}/dataviz/responses?selectedDate=2023-12-15&answerId=answer-id-2-2&isFeedbackVisible=true`;
const routeWithoutSelectedDate = `/dashboard/${mockedAppletId}/respondents/${mockedRespondentId}/dataviz/responses`;
const routePath = page.appletRespondentDataReview;
const preloadedState = {
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
    applet: mockedApplet,
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
        result: [mockedRespondent, mockedRespondent2],
        count: 2,
      },
    },
    subjectDetails: {
      ...initialStateData,
      data: {
        result: {
          id: '1',
          nickname: 'Mocked Respondent',
          secretUserId: mockedRespondentId,
          lastSeen: '2023-12-15T23:29:36.150182',
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

const items = [
  {
    question: {
      en: 'Single Selected - Mocked Item',
    },
    responseType: 'singleSelect',
    responseValues: {
      paletteName: null,
      options: [
        {
          id: '484596cc-0b4e-42a9-ab9d-20d4dae97d58',
          text: '1',
          isHidden: false,
          value: 0,
        },
        {
          id: 'a6ee9b74-e1d3-47b2-8c7f-fa9a22313b19',
          text: '2',
          isHidden: false,
          value: 1,
        },
      ],
    },
    config: {
      removeBackButton: false,
      skippableItem: true,
      randomizeOptions: false,
      timer: 0,
      addScores: false,
      setAlerts: false,
      addTooltip: false,
      setPalette: false,
      additionalResponseOption: {
        textInputOption: false,
        textInputRequired: false,
      },
    },
    name: 'ss-1',
    isHidden: false,
    allowEdit: true,
    id: 'ab383cc6-834b-45da-a0e1-fc21ca74b316',
    order: 1,
  },
];

const mockedGetWithActivities1 = {
  data: {
    result: [
      {
        id: '951145fa-3053-4428-a970-70531e383d89',
        name: 'Activity 1',
        answerDates: [],
      },
    ],
  },
};

const activity1 = {
  id: '951145fa-3053-4428-a970-70531e383d89',
  name: 'Activity 1',
  lastAnswerDate: '2023-12-15T11:22:34.150182',
  answerDates: [
    {
      createdAt: '2023-12-15T11:21:40.509095',
      answerId: 'answer-id-1-1',
    },
    {
      createdAt: '2023-12-15T11:22:34.150182',
      answerId: 'answer-id-1-2',
    },
  ],
};

const mockedGetWithActivities2 = {
  data: {
    result: [activity1],
  },
};

const mockedGetWithActivities3 = {
  data: {
    result: [
      activity1,
      {
        id: '2',
        name: 'Activity 2',
        lastAnswerDate: '2023-12-15T23:29:36.150182',
        answerDates: [
          {
            createdAt: '2023-12-15T21:20:30.150182',
            answerId: 'answer-id-2-1',
          },
          {
            createdAt: '2023-12-15T23:29:36.150182',
            answerId: 'answer-id-2-2',
          },
          {
            createdAt: '2023-12-15T22:20:30.150182',
            answerId: 'answer-id-2-3',
          },
        ],
      },
      {
        id: '3',
        name: 'Activity 3',
        lastAnswerDate: '2023-12-15T05:10:10.111222',
        answerDates: [
          {
            createdAt: '2023-12-15T05:10:10.111222',
            answerId: 'answer-id-3-1',
          },
        ],
      },
    ],
  },
};

const mockedGetWithDates = {
  data: {
    result: {
      dates: ['2023-12-11', '2023-12-15'],
    },
  },
};

const mockedGetWithResponses = {
  data: {
    result: {
      activity: {
        items,
      },
      answer: { id: 'answer-id' },
      summary: {
        createdAt: '2024-03-14T14:33:48.750000',
        identifier: 'test-identifier',
        version: '10.10.12',
      },
    },
  },
};

const mockDecryptedActivityData = {
  decryptedAnswers: [
    {
      activityItem: {
        question: {
          en: 'Single Selected - Mocked Item',
        },
        responseType: 'singleSelect',
        responseValues: {
          options: [
            {
              id: '484596cc-0b4e-42a9-ab9d-20d4dae97d58',
              text: '1',
              isHidden: false,
              value: 0,
            },
            {
              id: 'a6ee9b74-e1d3-47b2-8c7f-fa9a22313b19',
              text: '2',
              isHidden: false,
              value: 1,
            },
          ],
        },
        config: {
          removeBackButton: false,
          skippableItem: true,
          randomizeOptions: false,
          timer: 0,
          addScores: false,
          setAlerts: false,
          addTooltip: false,
          setPalette: false,
          additionalResponseOption: {
            textInputOption: false,
            textInputRequired: false,
          },
        },
        name: 'ss-1',
        isHidden: false,
        allowEdit: true,
        id: 'ab383cc6-834b-45da-a0e1-fc21ca74b316',
        order: 1,
      },
      answer: {
        value: '0',
        edited: null,
      },
      items,
    },
  ],
};

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
      mockAxios.get.mockResolvedValueOnce(mockedGetWithActivities1);
      mockAxios.get.mockResolvedValueOnce(mockedGetWithDates);
      mockAxios.get.mockResolvedValueOnce(mockedGetWithActivities2);
      mockAxios.get.mockResolvedValueOnce(mockedGetWithResponses);

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
          `/answers/applet/${mockedAppletId}/review/activities`,
          {
            params: {
              createdDate: format(date, DateFormats.YearMonthDay),
              limit: 10000,
              targetSubjectId: mockedRespondentId,
            },
            signal: undefined,
          },
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          2,
          `/answers/applet/${mockedAppletId}/dates`,
          {
            params: {
              targetSubjectId: mockedRespondentId,
              fromDate: startOfMonth(date).getTime().toString(),
              toDate: endOfMonth(date).getTime().toString(),
            },
            signal: undefined,
          },
        );
      });

      // check render child components
      expect(screen.getByTestId(`${dataTestid}-menu`)).toBeInTheDocument();
      expect(screen.getByTestId(`${dataTestid}-container`)).toBeInTheDocument();
      expect(screen.getByTestId(`${dataTestid}-feedback-button`)).toBeInTheDocument();

      expect(screen.getByText('No available Data yet')).toBeInTheDocument();

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
      const selectedDate = new Date('2023-12-15');
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
          3,
          `/answers/applet/${mockedAppletId}/review/activities`,
          {
            params: {
              createdDate: format(selectedDate, DateFormats.YearMonthDay),
              limit: 10000,
              targetSubjectId: mockedRespondentId,
            },
            signal: undefined,
          },
        );
        // get the answer with the latest completion date
        expect(mockAxios.get).toHaveBeenNthCalledWith(
          4,
          `/answers/applet/${mockedAppletId}/activities/951145fa-3053-4428-a970-70531e383d89/answers/answer-id-1-2`,
          {
            params: {
              limit: 10000,
            },
            signal: undefined,
          },
        );
        expect(mockAxios.get).toHaveBeenNthCalledWith(
          5,
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
          6,
          `/answers/applet/${mockedAppletId}/activities/951145fa-3053-4428-a970-70531e383d89/answers/answer-id-1-1`,
          {
            params: {
              limit: 10000,
            },
            signal: undefined,
          },
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          7,
          `/answers/applet/${mockedAppletId}/answers/answer-id-1-1/assessment`,
          {
            signal: undefined,
          },
        );
      });

      // check answer description render
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
          `/answers/applet/${mockedAppletId}/review/activities`,
          {
            params: {
              createdDate: '2023-12-15',
              limit: 10000,
              targetSubjectId: mockedRespondentId,
            },
            signal: undefined,
          },
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          2,
          `/answers/applet/${mockedAppletId}/dates`,
          {
            params: {
              targetSubjectId: mockedRespondentId,
              fromDate: startOfMonth(date).getTime().toString(),
              toDate: endOfMonth(date).getTime().toString(),
            },
            signal: undefined,
          },
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          3,
          `/answers/applet/${mockedAppletId}/activities/2/answers/answer-id-2-2`,
          {
            params: {
              limit: 10000,
            },
            signal: undefined,
          },
        );
      });

      expect(mockAxios.get).toHaveBeenNthCalledWith(
        4,
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
        `/answers/applet/${mockedAppletId}/review/activities`,
        {
          params: {
            createdDate: format(new Date('2023-12-15'), DateFormats.YearMonthDay),
            limit: 10000,
            targetSubjectId: mockedRespondentId,
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
