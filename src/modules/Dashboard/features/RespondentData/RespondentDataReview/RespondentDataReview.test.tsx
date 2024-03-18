// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { waitFor, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils';
import {
  mockedApplet,
  mockedAppletId,
  mockedCurrentWorkspace,
  mockedRespondent,
  mockedRespondent2,
  mockedRespondentId,
} from 'shared/mock';
import { DateFormats, Roles } from 'shared/consts';
import { initialStateData } from 'shared/state';
import { page } from 'resources';
import * as dashboardHooks from 'modules/Dashboard/hooks';

import { RespondentDataReview } from './RespondentDataReview';

const date = new Date('2023-12-27');
const dataTestid = 'respondents-review';

const route = `/dashboard/${mockedAppletId}/respondents/${mockedRespondentId}/dataviz/responses?selectedDate=2023-12-27`;
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
    respondentDetails: {
      ...initialStateData,
      data: {
        result: {
          nickname: 'Mocked Respondent',
          secretUserId: mockedRespondentId,
          lastSeen: '2023-12-11T08:40:41.424000',
        },
      },
    },
  },
};

jest.mock('modules/Dashboard/hooks', () => ({
  ...jest.requireActual('modules/Dashboard/hooks'),
  useDecryptedActivityData: jest.fn(),
}));

jest.mock('modules/Dashboard/features/RespondentData/CollapsedMdText', () => ({
  __esModule: true,
  ...jest.requireActual('modules/Dashboard/features/RespondentData/CollapsedMdText'),
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

const mockedGetWithActivities2 = {
  data: {
    result: [
      {
        id: '951145fa-3053-4428-a970-70531e383d89',
        name: 'Activity 1',
        answerDates: [
          {
            createdAt: '2023-12-15T11:21:40.509095',
            answerId: 'ff9e1f86-3fa2-4edd-908c-832810555633',
          },
          {
            createdAt: '2023-12-15T11:22:34.150182',
            answerId: 'd4147952-73e2-4693-b968-3ecf2468187d',
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
      mockedResult: 'mockedResult',
    },
  },
};

const JEST_TEST_TIMEOUT = 10000;

describe('RespondentDataReview', () => {
  test(
    'renders component correctly with all child components',
    async () => {
      mockAxios.get.mockResolvedValueOnce(mockedGetWithActivities1);
      mockAxios.get.mockResolvedValueOnce(mockedGetWithDates);
      mockAxios.get.mockResolvedValueOnce(mockedGetWithActivities2);
      mockAxios.get.mockResolvedValueOnce(mockedGetWithResponses);

      const getDecryptedActivityDataMock = jest.fn().mockReturnValue({
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
      });

      dashboardHooks.useDecryptedActivityData.mockReturnValue(getDecryptedActivityDataMock);

      renderWithProviders(<RespondentDataReview />, {
        preloadedState,
        route,
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
              respondentId: mockedRespondentId,
            },
            signal: undefined,
          },
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          2,
          `/answers/applet/${mockedAppletId}/dates`,
          {
            params: {
              respondentId: mockedRespondentId,
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

      expect(
        screen.getByText(
          'Select the date, Activity, and response time to review the response data.',
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
              respondentId: mockedRespondentId,
            },
            signal: undefined,
          },
        );
      });

      const timestampLength2 = screen.queryAllByTestId(
        /respondents-review-menu-activity-0-completion-time-\d+$/,
      );
      expect(timestampLength2).toHaveLength(2);

      const timestamp0 = screen.getByTestId(`${dataTestid}-menu-activity-0-completion-time-0`);
      expect(timestamp0).toBeInTheDocument();

      await userEvent.click(timestamp0);

      await waitFor(() => {
        expect(mockAxios.get).toHaveBeenNthCalledWith(
          4,
          `/answers/applet/${mockedAppletId}/answers/ff9e1f86-3fa2-4edd-908c-832810555633/activities/951145fa-3053-4428-a970-70531e383d89`,
          {
            params: {
              limit: 10000,
            },
            signal: undefined,
          },
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          5,
          `/answers/applet/${mockedAppletId}/answers/ff9e1f86-3fa2-4edd-908c-832810555633/assessment`,
          {
            signal: undefined,
          },
        );
      });

      // check question render
      expect(screen.getByText('Single Selected - Mocked Item')).toBeInTheDocument();

      // test open/close feedback panel
      const feedbackButton = screen.getByTestId(`${dataTestid}-feedback-button`);
      expect(feedbackButton).toBeInTheDocument();

      const feedbackMenu = screen.getByTestId(`${dataTestid}-feedback-menu`);
      expect(feedbackMenu).toBeInTheDocument();
      expect(feedbackMenu).toHaveStyle({ display: 'none' });

      await userEvent.click(feedbackButton);

      expect(feedbackMenu).toHaveStyle({
        display: 'flex',
      });

      const feedbackMenuClose = screen.getByTestId(`${dataTestid}-feedback-menu-close`);
      expect(feedbackMenuClose).toBeInTheDocument();

      await userEvent.click(feedbackMenuClose);

      expect(feedbackMenu).toHaveStyle({ display: 'none' });
    },
    JEST_TEST_TIMEOUT,
  );

  test('test if default review date is equal to last activity completed date', async () => {
    renderWithProviders(<RespondentDataReview />, {
      preloadedState,
      route: routeWithoutSelectedDate,
      routePath,
    });

    const inputContainer = await screen.findByTestId(`${dataTestid}-menu-review-date`);
    expect(inputContainer).toBeInTheDocument();

    const input = inputContainer.querySelector('input') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toEqual('11 Dec 2023');
  });
});
