// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { waitFor, screen, fireEvent } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { ApiResponseCodes } from 'api';
import * as dashboardHooks from 'modules/Dashboard/hooks';
import { page } from 'resources';
import { Roles } from 'shared/consts';
import { mockedApplet, mockedAppletId, mockedCurrentWorkspace, mockedRespondent } from 'shared/mock';
import { initialStateData } from 'shared/state';
import { renderWithProviders } from 'shared/utils';

import { FeedbackReviewed } from './FeedbackReviewed';

const reviewerTestId = 'respondents-data-summary-feedback-reviewed-reviewer';
const mockedAnswerId = '0a7bcd14-24a3-48ed-8d6b-b059a6541ae4';
const route = `/dashboard/${mockedAppletId}/respondents/${mockedRespondent}/dataviz/review?selectedDate=2023-11-27&answerId=${mockedAnswerId}`;
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
};

const items = [
  {
    question: {
      en: 'ss-1',
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
  {
    question: {
      en: 'ms-1',
    },
    responseType: 'multiSelect',
    responseValues: {
      options: [
        {
          id: '0ad7f2a4-f1b1-4f33-b260-10b0c51c81b4',
          text: '1',
          isHidden: false,
          value: 0,
        },
        {
          id: '2a797f6c-c9c2-4f33-831e-a45041aa7951',
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
    name: 'ms-1',
    isHidden: false,
    conditionalLogic: null,
    allowEdit: true,
    id: '0bd5d605-2e82-4e70-9eec-352b26b5f45d',
    order: 2,
  },
];

jest.mock('modules/Dashboard/hooks', () => ({
  ...jest.requireActual('modules/Dashboard/hooks'),
  useDecryptedActivityData: jest.fn(),
}));

const mockedGetWithReviews = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: [
      {
        reviewerPublicKey: 'c48b275d-db4b-4f79-8469-9198b45985d3',
        answer:
          'b1d8d920ba7f62efb363e5af68d86c52:031545665b124e3bb9a7e2e96271bd720cd2af34eb255ef4228591835bdb441ca15020c09ed009ff6e11f1180fe962e63af669e6b2d1265833a028f536e29ca0',
        itemIds: ['ab383cc6-834b-45da-a0e1-fc21ca74b316', '0bd5d605-2e82-4e70-9eec-352b26b5f45d'],
        items,
        reviewer: {
          firstName: 'Jane',
          lastName: 'Doe',
        },
      },
    ],
    count: 1,
  },
};

const mockedGetWithEmptyReviews = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: [],
    count: 0,
  },
};

jest.mock('modules/Dashboard/features/RespondentData/CollapsedMdText', () => ({
  __esModule: true,
  CollapsedMdText: jest.fn(() => <div data-testid="mock-collapsed-md-text">Mocked CollapsedMdText</div>),
}));

describe('FeedbackReviewed', () => {
  test('should render array of reviews with/without edited labels', async () => {
    mockAxios.get.mockResolvedValueOnce(mockedGetWithReviews);

    const getDecryptedActivityDataMock = jest.fn().mockReturnValue(
      Promise.resolve({
        decryptedAnswers: [
          {
            activityItem: {
              question: {
                en: 'ss-1',
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
          {
            activityItem: {
              question: {
                en: 'ms-1',
              },
              responseType: 'multiSelect',
              responseValues: {
                options: [
                  {
                    id: '0ad7f2a4-f1b1-4f33-b260-10b0c51c81b4',
                    text: '1',
                    isHidden: false,
                    value: 0,
                  },
                  {
                    id: '2a797f6c-c9c2-4f33-831e-a45041aa7951',
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
              name: 'ms-1',
              isHidden: false,
              allowEdit: true,
              id: '0bd5d605-2e82-4e70-9eec-352b26b5f45d',
              order: 2,
            },
            answer: {
              value: ['0', '1'],
              edited: 1701342809040,
            },
            items,
          },
        ],
      }),
    );

    dashboardHooks.useDecryptedActivityData.mockReturnValue(getDecryptedActivityDataMock);

    renderWithProviders(<FeedbackReviewed />, {
      preloadedState,
      route,
      routePath,
    });

    await waitFor(() => {
      expect(mockAxios.get).nthCalledWith(1, `/answers/applet/${mockedAppletId}/answers/${mockedAnswerId}/reviews`, {
        signal: undefined,
      });
    });

    const elementsWithTestIdSubstring = screen.queryAllByTestId(
      /respondents-data-summary-feedback-reviewed-reviewer-\d+$/,
    );
    expect(elementsWithTestIdSubstring).toHaveLength(1);
    expect(screen.queryByTestId(`${reviewerTestId}-0-review-0-edited`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`${reviewerTestId}-0-review-1-edited`)).not.toBeInTheDocument();

    const collapseButton = screen.getByTestId(`${reviewerTestId}-0-collapse`) as HTMLElement;
    expect(collapseButton).toBeInTheDocument();

    fireEvent.click(collapseButton);

    await waitFor(() => {
      expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();
      expect(screen.queryByTestId(`${reviewerTestId}-0-review-0-edited`)).not.toBeInTheDocument();
      expect(screen.getByTestId(`${reviewerTestId}-0-review-1-edited`)).toBeInTheDocument();
    });
  });

  test('should render empty state', async () => {
    mockAxios.get.mockResolvedValueOnce(mockedGetWithEmptyReviews);

    const getDecryptedActivityDataMock = jest.fn().mockReturnValue({
      decryptedAnswers: [],
    });

    dashboardHooks.useDecryptedActivityData.mockReturnValue(getDecryptedActivityDataMock);

    renderWithProviders(<FeedbackReviewed />, {
      preloadedState,
      route,
      routePath,
    });

    await waitFor(() => {
      expect(screen.getByText('No reviewer has completed the Assessment for this.')).toBeInTheDocument();
    });
  });
});
