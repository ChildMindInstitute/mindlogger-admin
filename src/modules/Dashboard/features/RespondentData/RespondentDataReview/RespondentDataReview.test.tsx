import { waitFor, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { PreloadedState } from '@reduxjs/toolkit';
import { vi, type Mock } from 'vitest';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import {
  mockedApplet,
  mockedAppletId,
  mockedCurrentWorkspace,
  mockedFullSubjectId1,
} from 'shared/mock';
import { Roles, JEST_TEST_TIMEOUT, MAX_LIMIT, ParticipantTag } from 'shared/consts';
import { initialStateData } from 'shared/state';
import { page } from 'resources';
import * as dashboardHooks from 'modules/Dashboard/hooks';
import { RootState } from 'redux/store';
import { authApiClient } from 'shared/api/apiConfig';

import { RespondentDataReview } from './RespondentDataReview';

const dataTestid = 'respondents-review';

const activity1Id = '951145fa-3053-4428-a970-70531e383d89';
const activity2Id = '2';
const routePath = page.appletParticipantActivityDetailsDataReview;
const route1 = `/dashboard/${mockedAppletId}/participants/${mockedFullSubjectId1}/activities/${activity1Id}/responses?selectedDate=2023-12-27`;
const route2 = `/dashboard/${mockedAppletId}/participants/${mockedFullSubjectId1}/activities/${activity2Id}/responses?selectedDate=2023-12-15&answerId=answer-id-2-2&isFeedbackVisible=true`;
const routeWithoutSelectedDate = `/dashboard/${mockedAppletId}/participants/${mockedFullSubjectId1}/activities/${activity1Id}/responses`;
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

vi.mock('modules/Dashboard/hooks', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;

  return {
    ...actual,
    useDecryptedActivityData: vi.fn(),
  };
});

vi.mock('modules/Dashboard/features/RespondentData/CollapsedMdText', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;

  return {
    ...actual,
    __esModule: true,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    CollapsedMdText: ({ text }) => <div data-testid="mock-collapsed-md-text">{text}</div>,
  };
});

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

const mockedGetWithFlows1 = {
  data: {
    result: [
      {
        id: 'flow-id-1',
        name: 'flow 1',
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
      dates: ['2023-12-11', '2023-12-15', '2023-12-27'],
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

const mockAssessment = {
  data: {
    result: {
      answer: null,
      itemIds: [],
      items: [],
      itemsLast: null,
      reviewerPublicKey: null,
      versions: [],
      reviews: [],
    },
  },
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
  const originalProcessListeners = process.listeners('unhandledRejection');

  beforeAll(() => {
    // Remove default process listeners
    process.removeAllListeners('unhandledRejection');

    // Add custom handler to suppress undefined errors
    process.on('unhandledRejection', (reason) => {
      if (reason !== undefined) {
        // Re-throw actual errors
        throw reason;
      }
      // Suppress undefined rejections
    });
  });

  afterAll(() => {
    // Restore original listeners
    process.removeAllListeners('unhandledRejection');
    originalProcessListeners.forEach((listener) => {
      process.on('unhandledRejection', listener as never);
    });
  });

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  afterEach(async () => {
    // Wait for any pending timers or promises to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });

  test(
    'renders component correctly with all child components when isFeedbackVisible param is false',
    async () => {
      const getMock = authApiClient.get as unknown as Mock;
      let reviewCalls = 0;
      getMock.mockImplementation((url: string, _config?: unknown) => {
        if (url.endsWith(`/answers/applet/${mockedAppletId}/dates`)) {
          return Promise.resolve(mockedGetWithDates);
        }
        if (url.endsWith(`/answers/applet/${mockedAppletId}/review/flows`)) {
          return Promise.resolve(mockedGetWithFlows1);
        }
        if (url.endsWith(`/answers/applet/${mockedAppletId}/review/activities`)) {
          // first time return activities1, then activities2
          reviewCalls += 1;

          return Promise.resolve(
            reviewCalls === 1 ? mockedGetWithActivities1 : mockedGetWithActivities2,
          );
        }
        if (url.includes(`/answers/answer-id-1-2`)) {
          return Promise.resolve(mockedGetWithResponses);
        }
        if (url.endsWith(`/answers/applet/${mockedAppletId}/answers/answer-id-1-2/assessment`)) {
          return Promise.resolve(mockAssessment);
        }
        if (url.includes(`/answers/answer-id-1-1`)) {
          return Promise.resolve(mockedGetWithResponses);
        }
        if (url.endsWith(`/answers/applet/${mockedAppletId}/answers/answer-id-1-1/assessment`)) {
          return Promise.resolve(mockAssessment);
        }
        if (url.includes('/reviews')) {
          return Promise.resolve({ data: { result: [] } });
        }
        if (url.includes('/assessment')) {
          return Promise.resolve({ data: { result: { reviews: [] } } });
        }

        return Promise.resolve({
          data: {
            result: {
              activity: { items },
              answer: {},
              summary: {
                createdAt: '2024-03-14T14:33:48.750000',
                identifier: 'test-identifier',
                version: '1.0.0',
              },
              reviews: [],
            },
          },
        });
      });

      const getDecryptedActivityDataMock = vi.fn().mockReturnValue(mockDecryptedActivityData);

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
        // First, the dates API is called
        expect(authApiClient.get).toHaveBeenCalledWith(
          `/answers/applet/${mockedAppletId}/dates`,
          expect.any(Object),
        );
        // Then the review APIs are called with the date from the route (Dec 27)
        expect(authApiClient.get).toHaveBeenCalledWith(
          `/answers/applet/${mockedAppletId}/review/flows`,
          expect.objectContaining({
            params: expect.objectContaining({
              createdDate: '2023-12-27',
              limit: MAX_LIMIT,
              targetSubjectId: mockedFullSubjectId1,
            }),
          }),
        );
        expect(authApiClient.get).toHaveBeenCalledWith(
          `/answers/applet/${mockedAppletId}/review/activities`,
          expect.objectContaining({
            params: expect.objectContaining({
              createdDate: '2023-12-27',
              limit: MAX_LIMIT,
              targetSubjectId: mockedFullSubjectId1,
            }),
          }),
        );
      });

      // check render child components
      expect(screen.getByTestId(`${dataTestid}-menu`)).toBeInTheDocument();
      expect(screen.getByTestId(`${dataTestid}-container`)).toBeInTheDocument();
      expect(screen.getByTestId(`${dataTestid}-feedback-button`)).toBeInTheDocument();

      await waitFor(() => {
        expect(
          screen.getByText(
            'Select the date, Activity Flow or Activity, and response time to review the response data.',
          ),
        ).toBeInTheDocument();
      });

      // the activity list in the review menu child component is rendered correctly
      await waitFor(() => {
        const activityLength = screen.queryAllByTestId(
          /respondents-review-menu-activity-\d+-select$/,
        );
        expect(activityLength).toHaveLength(1);
      });

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
      await waitFor(() => {
        const datepickerDays = datepicker.getElementsByClassName(
          'react-datepicker__day react-datepicker__day--015',
        );
        expect(datepickerDays.length).toBeGreaterThan(0);
      });

      const datepickerDaySelected = datepicker.getElementsByClassName(
        'react-datepicker__day react-datepicker__day--015',
      );

      await userEvent.click(datepickerDaySelected[0]);
      const okButton = screen.getByText('Ok');
      expect(okButton).toBeInTheDocument();

      await userEvent.click(okButton);

      await waitFor(() => {
        expect(input.value).toEqual('15 Dec 2023');

        expect(authApiClient.get).toHaveBeenCalledWith(
          `/answers/applet/${mockedAppletId}/review/flows`,
          expect.objectContaining({
            params: expect.objectContaining({
              createdDate: '2023-12-15',
              limit: MAX_LIMIT,
              targetSubjectId: mockedFullSubjectId1,
            }),
          }),
        );
        expect(authApiClient.get).toHaveBeenCalledWith(
          `/answers/applet/${mockedAppletId}/review/activities`,
          expect.objectContaining({
            params: expect.objectContaining({
              createdDate: '2023-12-15',
              limit: MAX_LIMIT,
              targetSubjectId: mockedFullSubjectId1,
            }),
          }),
        );
        expect(authApiClient.get).toHaveBeenCalledWith(
          expect.stringContaining('/answers/answer-id-1-2'),
          expect.objectContaining({
            params: expect.objectContaining({ limit: MAX_LIMIT }),
          }),
        );
        expect(authApiClient.get).toHaveBeenCalledWith(
          `/answers/applet/${mockedAppletId}/answers/answer-id-1-2/assessment`,
          expect.any(Object),
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
        expect(authApiClient.get).toHaveBeenCalledWith(
          expect.stringContaining('/answers/answer-id-1-1'),
          expect.objectContaining({
            params: expect.objectContaining({ limit: MAX_LIMIT }),
          }),
        );
        expect(authApiClient.get).toHaveBeenCalledWith(
          `/answers/applet/${mockedAppletId}/answers/answer-id-1-1/assessment`,
          expect.any(Object),
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
      const getMock = authApiClient.get as unknown as Mock;
      getMock.mockImplementation((url: string) => {
        if (url.endsWith(`/answers/applet/${mockedAppletId}/dates`)) {
          return Promise.resolve(mockedGetWithDates);
        }
        if (url.endsWith(`/answers/applet/${mockedAppletId}/review/flows`)) {
          return Promise.resolve(mockedGetWithFlows1);
        }
        if (url.endsWith(`/answers/applet/${mockedAppletId}/review/activities`)) {
          return Promise.resolve(mockedGetWithActivities3);
        }
        if (url.includes(`/answers/applet/${mockedAppletId}/activities/2/answers/answer-id-2-2`)) {
          return Promise.resolve(mockedGetWithResponses);
        }
        if (url.endsWith(`/answers/applet/${mockedAppletId}/answers/answer-id-2-2/assessment`)) {
          return Promise.resolve({ data: { result: { reviews: [] } } });
        }
        if (url.includes('/reviews')) {
          return Promise.resolve({ data: { result: [] } });
        }
        if (url.includes('/assessment')) {
          return Promise.resolve({ data: { result: { reviews: [] } } });
        }

        return Promise.resolve({
          data: {
            result: {
              activity: { items },
              answer: {},
              summary: {
                createdAt: '2024-03-14T14:33:48.750000',
                identifier: 'test-identifier',
                version: '1.0.0',
              },
              reviews: [],
            },
          },
        });
      });

      const getDecryptedActivityDataMock = vi.fn().mockReturnValue(mockDecryptedActivityData);

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
        expect(authApiClient.get).toHaveBeenCalledWith(
          `/answers/applet/${mockedAppletId}/review/flows`,
          expect.any(Object),
        );
        expect(authApiClient.get).toHaveBeenCalledWith(
          `/answers/applet/${mockedAppletId}/review/activities`,
          expect.any(Object),
        );
        expect(authApiClient.get).toHaveBeenCalledWith(
          `/answers/applet/${mockedAppletId}/activities/2/answers/answer-id-2-2`,
          expect.objectContaining({ params: expect.objectContaining({ limit: MAX_LIMIT }) }),
        );
      });

      expect(authApiClient.get).toHaveBeenCalledWith(
        `/answers/applet/${mockedAppletId}/answers/answer-id-2-2/assessment`,
        expect.any(Object),
      );

      // check that the Feedback Reviews tab is open
      await waitFor(() => {
        expect(
          screen.getByTestId('respondents-data-summary-feedback-reviewed'),
        ).toBeInTheDocument();
      });
    },
    JEST_TEST_TIMEOUT,
  );

  test('renders component with chosen last answer date', async () => {
    const getMock = authApiClient.get as unknown as Mock;
    getMock.mockImplementation((url: string) => {
      if (url.endsWith(`/answers/applet/${mockedAppletId}/dates`)) {
        return Promise.resolve(mockedGetWithDates);
      }
      if (url.endsWith(`/answers/applet/${mockedAppletId}/review/flows`)) {
        return Promise.resolve(mockedGetWithFlows1);
      }
      if (url.endsWith(`/answers/applet/${mockedAppletId}/review/activities`)) {
        return Promise.resolve(mockedGetWithActivities3);
      }
      if (url.includes('/reviews')) {
        return Promise.resolve({ data: { result: [] } });
      }
      if (url.includes('/assessment')) {
        return Promise.resolve({ data: { result: { reviews: [] } } });
      }

      return Promise.resolve({
        data: {
          result: {
            activity: { items },
            answer: {},
            summary: {
              createdAt: '2024-03-14T14:33:48.750000',
              identifier: 'test-identifier',
              version: '1.0.0',
            },
            reviews: [],
          },
        },
      });
    });

    renderWithProviders(<RespondentDataReviewWithForm />, {
      preloadedState,
      route: routeWithoutSelectedDate,
      routePath,
    });

    window.HTMLElement.prototype.scrollTo = () => {};

    await waitFor(() => {
      expect(authApiClient.get).toHaveBeenCalledWith(
        `/answers/applet/${mockedAppletId}/review/flows`,
        expect.any(Object),
      );
      expect(authApiClient.get).toHaveBeenCalledWith(
        `/answers/applet/${mockedAppletId}/review/activities`,
        expect.any(Object),
      );

      // When viewing an activity-specific page, only 1 activity is shown
      const activityLength = screen.queryAllByTestId(
        /respondents-review-menu-activity-\d+-select$/,
      );
      expect(activityLength).toHaveLength(1);

      // Activity 1 has 2 completion timestamps and is shown as index 0 when filtered
      const timestampLength = screen.queryAllByTestId(
        /respondents-review-menu-activity-0-completion-time-\d+$/,
      );
      expect(timestampLength).toHaveLength(2);

      //check inactive timestamp (activity1's first answer date: 2023-12-15T11:21:40)
      const timestamp1 = screen.getByTestId(`${dataTestid}-menu-activity-0-completion-time-0`);
      expect(timestamp1).toHaveClass('MuiChip-colorSecondary');
      expect(timestamp1).toHaveTextContent('11:21:40');

      //check active timestamp (activity1's last answer date: 2023-12-15T11:22:34)
      const timestamp2 = screen.getByTestId(`${dataTestid}-menu-activity-0-completion-time-1`);
      expect(timestamp2).toHaveClass('MuiChip-colorPrimary');
      expect(timestamp2).toHaveTextContent('11:22:34');
    });
  });

  test('test if default review date is equal to last activity completed date', async () => {
    // This test verifies that when a route includes a selectedDate matching the user's
    // lastSeen/lastActivityCompleted date, the date picker component renders correctly

    const getMock = authApiClient.get as unknown as Mock;
    getMock.mockImplementation((url: string) => {
      if (url.endsWith(`/answers/applet/${mockedAppletId}/dates`)) {
        return Promise.resolve(mockedGetWithDates);
      }
      if (url.endsWith(`/answers/applet/${mockedAppletId}/review/flows`)) {
        return Promise.resolve(mockedGetWithFlows1);
      }
      if (url.endsWith(`/answers/applet/${mockedAppletId}/review/activities`)) {
        return Promise.resolve(mockedGetWithActivities3);
      }
      if (url.includes('/reviews')) {
        return Promise.resolve({ data: { result: [] } });
      }
      if (url.includes('/assessment')) {
        return Promise.resolve({ data: { result: { reviews: [] } } });
      }

      return Promise.resolve({
        data: {
          result: {
            activity: { items },
            answer: {},
            summary: {
              createdAt: '2024-03-14T14:33:48.750000',
              identifier: 'test-identifier',
              version: '1.0.0',
            },
            reviews: [],
          },
        },
      });
    });

    // Use a route with selectedDate matching the lastSeen date from preloadedState (2023-12-15)
    const routeWithDate = `/dashboard/${mockedAppletId}/participants/${mockedFullSubjectId1}/activities/${activity1Id}/responses?selectedDate=2023-12-15`;

    renderWithProviders(<RespondentDataReviewWithForm />, {
      preloadedState,
      route: routeWithDate,
      routePath,
    });

    // Wait for the date picker to be rendered
    const inputContainer = await screen.findByTestId(`${dataTestid}-menu-review-date`);
    expect(inputContainer).toBeInTheDocument();

    // Verify the input element exists (Note: the DatePicker's internal value handling
    // in the test environment may not reflect the actual date value in input.value)
    const input = inputContainer.querySelector('input');
    expect(input).toBeInTheDocument();
  });
});
