import { fireEvent, screen, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';
import { endOfMonth, startOfMonth } from 'date-fns';

import { page } from 'resources';
import { renderWithProviders } from 'shared/utils';
import {
  mockedApplet,
  mockedAppletId,
  mockedCurrentWorkspace,
  mockedRespondent,
  mockedRespondent2,
  mockedRespondentId,
} from 'shared/mock';
import { Roles } from 'shared/consts';
import { initialStateData } from 'shared/state';

import { ReviewMenu } from './ReviewMenu';
import { ReviewMenuProps } from './ReviewMenu.types';

const mockedAnswerId = '0a7bcd14-24a3-48ed-8d6b-b059a6541ae4';
const route = `/dashboard/${mockedAppletId}/respondents/${mockedRespondentId}/dataviz/review?selectedDate=2023-12-05&answerId=${mockedAnswerId}`;
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
          secretUserId: '3921968c-3903-4872-8f30-a6e6a10cef36',
        },
      },
    },
  },
};

const mockedDate = '2023-12-05';
const dataTestid = 'respondents-review';
const commonProps = {
  selectedActivity: null,
  selectedAnswer: null,
  setSelectedActivity: jest.fn(),
  onSelectAnswer: jest.fn(),
};

const getReviewMenuComponent = (props: ReviewMenuProps) =>
  renderWithProviders(<ReviewMenu {...props} />, {
    preloadedState,
    route,
    routePath,
  });

describe('ReviewMenu', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  test('component should render correctly', async () => {
    getReviewMenuComponent(commonProps);
    expect(screen.getByText('Review')).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestid}-review-date`)).toBeInTheDocument();
    expect(
      screen.getByText('User: 3921968c-3903-4872-8f30-a6e6a10cef36 (Mocked Respondent)'),
    ).toBeInTheDocument();
    expect(screen.getByText('Select activity and response')).toBeInTheDocument();
  });

  test('fetches activities and select activity and specific date', async () => {
    const fromDate = startOfMonth(new Date(mockedDate)).getTime().toString();
    const toDate = endOfMonth(new Date(mockedDate)).getTime().toString();

    mockAxios.get.mockResolvedValueOnce({
      data: {
        result: {
          dates: ['2023-12-03', '2023-12-05'],
        },
      },
    });

    mockAxios.get.mockResolvedValueOnce({
      data: {
        result: [
          {
            id: '19471c61-bade-4caf-90a7-07307a811d44',
            name: 'New Activity 1',
            answerDates: [
              {
                createdAt: '2023-12-05T17:10:50.428740',
                answerId: 'e341e33a-5322-4bde-ab85-e2e04597742e',
              },
            ],
          },
          {
            id: 'e128dff4-3448-499c-bcd1-bac208848744',
            name: 'New Activity 2',
            answerDates: [],
          },
        ],
      },
    });

    const onSelectAnswer = jest.fn();
    getReviewMenuComponent({
      ...commonProps,
      onSelectAnswer,
    });

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith(`/answers/applet/${mockedAppletId}/dates`, {
        params: {
          respondentId: mockedRespondentId,
          fromDate,
          toDate,
        },
      });
    });

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith(
        `/answers/applet/${mockedAppletId}/review/activities`,
        {
          params: {
            respondentId: mockedRespondentId,
            createdDate: mockedDate,
            limit: 10000,
          },
        },
      );
    });

    await waitFor(() => {
      const activity = screen.getByTestId(`${dataTestid}-activity-0-select`);
      expect(activity).toBeInTheDocument();

      fireEvent.click(activity);
    });

    const timestamp = screen.getByTestId(`${dataTestid}-activity-0-completion-time-0`);
    expect(timestamp).toBeInTheDocument();
    fireEvent.click(timestamp);

    expect(onSelectAnswer).toBeCalledWith({
      createdAt: '2023-12-05T17:10:50.428740',
      answerId: 'e341e33a-5322-4bde-ab85-e2e04597742e',
    });
  });
});
