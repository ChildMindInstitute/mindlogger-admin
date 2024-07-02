import { ReactNode } from 'react';
import { screen, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';
import { FormProvider, useForm } from 'react-hook-form';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import {
  mockedApplet,
  mockedAppletId,
  mockedCurrentWorkspace,
  mockedRespondent,
} from 'shared/mock';
import { Roles } from 'shared/consts';
import { initialStateData, Item } from 'shared/state';
import { page } from 'resources';
import { ApiResponseCodes } from 'api';
import * as dashboardHooks from 'modules/Dashboard/hooks';
import { assessment, assessmentVersions, itemIds, lastAssessment } from 'shared/mock';

import { FeedbackReviews } from './FeedbackReviews';
import { AssessmentActivityItem } from '../../RespondentDataReview.types';
import { RespondentDataReviewContext } from '../../RespondentDataReview.context';
import { FeedbackForm } from '../Feedback.types';
import { getDefaultFormValues } from '../utils/getDefaultValues/getDefaultValues';

const mockedAnswerId = '0a7bcd14-24a3-48ed-8d6b-b059a6541ae4';
const route = `/dashboard/${mockedAppletId}/participants/${mockedRespondent}/dataviz/responses?selectedDate=2023-11-27&answerId=${mockedAnswerId}`;
const routePath = page.appletParticipantDataReview;
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
  auth: {
    authentication: {
      ...initialStateData,
      data: {
        user: {
          email: 'test@test.com',
          firstName: 'John',
          lastName: 'Doe',
          id: 'owner-id',
        },
      },
    },
    isAuthorized: true,
    isLogoutInProgress: false,
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

const mockedGetWithEmptyReviews = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: [],
    count: 0,
  },
};

const mockedGetWithReviews = (hasUserReview: boolean) => ({
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: [
      {
        createdAt: '2024-03-14T14:50:38.637755',
        updatedAt: '2024-03-14T14:50:38.637755',
        id: 'review-id',
        reviewerPublicKey: 'c48b275d-db4b-4f79-8469-9198b45985d3',
        answer:
          'b1d8d920ba7f62efb363e5af68d86c52:031545665b124e3bb9a7e2e96271bd720cd2af34eb255ef4228591835bdb441ca15020c09ed009ff6e11f1180fe962e63af669e6b2d1265833a028f536e29ca0',
        itemIds: ['ab383cc6-834b-45da-a0e1-fc21ca74b316', '0bd5d605-2e82-4e70-9eec-352b26b5f45d'],
        items,
        reviewer: {
          firstName: 'Jane',
          lastName: 'Doe',
          id: 'reviewer-id',
        },
      },
      ...(hasUserReview
        ? [
            {
              createdAt: '2024-03-14T14:50:38.637755',
              updatedAt: '2024-03-14T14:50:38.637755',
              id: 'review-id-2',
              reviewerPublicKey: 'public-key',
              answer:
                'b1d8d920ba7f62efb363e5af68d86c52:031545665b124e3bb9a7e2e96271bd720cd2af34eb255ef4228591835bdb441ca15020c09ed009ff6e11f1180fe962e63af669e6b2d1265833a028f536e29ca0',
              itemIds: [
                'ab383cc6-834b-45da-a0e1-fc21ca74b316',
                '0bd5d605-2e82-4e70-9eec-352b26b5f45d',
              ],
              items,
              reviewer: {
                firstName: 'John',
                lastName: 'Doe',
                id: 'owner-id',
              },
            },
          ]
        : []),
    ],
    count: 2,
  },
});

const mockedGetWithReviewsNoAnswers = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: [
      {
        createdAt: '2024-03-14T14:50:38.637755',
        updatedAt: '2024-03-14T14:50:38.637755',
        id: 'review-id',
        reviewerPublicKey: null,
        answer: null,
        itemIds: ['ab383cc6-834b-45da-a0e1-fc21ca74b316', '0bd5d605-2e82-4e70-9eec-352b26b5f45d'],
        items,
        reviewer: {
          firstName: 'Jane',
          lastName: 'Doe',
          id: 'reviewer-id',
        },
      },
      {
        createdAt: '2024-03-15T14:55:38.637755',
        updatedAt: '2024-03-15T14:55:38.637755',
        id: 'review-id',
        reviewerPublicKey: null,
        answer: null,
        itemIds: ['ab383cc6-834b-45da-a0e1-fc21ca74b3162', '0bd5d605-2e82-4e70-9eec-352b26b5f45d2'],
        items,
        reviewer: {
          firstName: 'John',
          lastName: 'Doe',
          id: 'reviewer-id-2',
        },
      },
    ],
    count: 2,
  },
};

jest.mock('modules/Dashboard/features/RespondentData/CollapsedMdText', () => ({
  __esModule: true,
  CollapsedMdText: jest.fn(() => (
    <div data-testid="mock-collapsed-md-text">Mocked CollapsedMdText</div>
  )),
}));

const setIsLastVersion = jest.fn();
const setIsBannerVisible = jest.fn();
const setAssessment = jest.fn();
const getMockedContext = (
  assessment: AssessmentActivityItem[],
  lastAssessment: Item[],
  isLastVersion: boolean,
  isBannerVisible: boolean,
) => ({
  assessment,
  setAssessment,
  lastAssessment,
  assessmentVersions,
  isLastVersion,
  setIsLastVersion,
  isBannerVisible,
  setIsBannerVisible,
  itemIds,
  setItemIds: jest.fn(),
  isFeedbackOpen: true,
});

const FormComponent = ({
  children,
  assessment,
}: {
  children: ReactNode;
  assessment: AssessmentActivityItem[];
}) => {
  const methods = useForm<FeedbackForm>({
    defaultValues: getDefaultFormValues(assessment),
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

const renderComponent = (
  assessment: AssessmentActivityItem[],
  lastAssessment: Item[],
  isLastVersion: boolean,
  isBannerVisible: boolean,
) =>
  renderWithProviders(
    <RespondentDataReviewContext.Provider
      value={getMockedContext(assessment, lastAssessment, isLastVersion, isBannerVisible)}
    >
      <FormComponent assessment={assessment}>
        <FeedbackReviews />
      </FormComponent>
    </RespondentDataReviewContext.Provider>,
    {
      preloadedState,
      route,
      routePath,
    },
  );

const getDecryptedActivityData = () => {
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

  jest
    .spyOn(dashboardHooks, 'useDecryptedActivityData')
    .mockReturnValue(getDecryptedActivityDataMock);
};

describe('FeedbackReviewed', () => {
  test('banner should be visible', () => {
    renderComponent(assessment, lastAssessment, false, true);

    const banner = screen.getByTestId('assessment-banner');
    const height = getComputedStyle(banner).getPropertyValue('height');
    expect(height).toEqual('auto');
  });

  test('banner should not be visible', () => {
    renderComponent(assessment, lastAssessment, false, false);

    const banner = screen.queryByTestId('assessment-banner');
    expect(banner).toBeNull();
  });

  test('should render array of reviews with empty review, show feedback assessment on add button click', async () => {
    mockAxios.get.mockResolvedValueOnce(mockedGetWithReviews(false));
    getDecryptedActivityData();
    renderComponent(assessment, lastAssessment, false, true);

    await waitFor(() => {
      expect(mockAxios.get).nthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/answers/${mockedAnswerId}/reviews`,
        { signal: undefined },
      );
    });

    expect(
      screen.getByTestId('respondents-data-summary-feedback-reviewed-empty-review'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('respondents-data-summary-feedback-reviewed-add-review'),
    ).toBeInTheDocument();
    expect(screen.getByText('John Doe (Me)')).toBeInTheDocument();
    const elementsWithTestIdSubstring = screen.queryAllByTestId(
      /respondents-data-summary-feedback-reviewed-reviewer-\d+$/,
    );
    expect(elementsWithTestIdSubstring).toHaveLength(1);
    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();

    await userEvent.click(
      screen.getByTestId('respondents-data-summary-feedback-reviewed-add-review'),
    );

    expect(screen.getByTestId('respondents-data-summary-feedback-assessment')).toBeInTheDocument();
    expect(
      screen.queryByTestId('respondents-data-summary-feedback-reviewed-empty-review'),
    ).not.toBeInTheDocument();
  });

  test('should render reviews with no permission', async () => {
    mockAxios.get.mockResolvedValueOnce(mockedGetWithReviewsNoAnswers);
    renderComponent(assessment, lastAssessment, false, true);

    await waitFor(() => {
      expect(mockAxios.get).nthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/answers/${mockedAnswerId}/reviews`,
        { signal: undefined },
      );
    });

    const elementsWithTestIdSubstring = screen.queryAllByTestId(
      /respondents-data-summary-feedback-reviewed-reviewer-\d+$/,
    );
    expect(elementsWithTestIdSubstring).toHaveLength(2);

    const elementsWithLock = screen.queryAllByTestId(
      /respondents-data-summary-feedback-reviewed-reviewer-\d+-lock/,
    );
    expect(elementsWithLock).toHaveLength(2);
  });

  test('should render array of reviews with review of current user, should delete review', async () => {
    mockAxios.get.mockResolvedValueOnce(mockedGetWithReviews(true));
    getDecryptedActivityData();
    renderComponent(assessment, lastAssessment, false, true);

    await waitFor(() => {
      expect(mockAxios.get).nthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/answers/${mockedAnswerId}/reviews`,
        { signal: undefined },
      );
    });

    expect(
      screen.queryByTestId('respondents-data-summary-feedback-reviewed-empty-review'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('respondents-data-summary-feedback-reviewed-add-review'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('respondents-data-summary-feedback-assessment'),
    ).not.toBeInTheDocument();

    const elementsWithTestIdSubstring = screen.queryAllByTestId(
      /respondents-data-summary-feedback-reviewed-reviewer-\d+$/,
    );

    expect(elementsWithTestIdSubstring).toHaveLength(2);
    expect(screen.getByText('John Doe (Me)')).toBeInTheDocument();
    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();

    const removeButton = screen.getByTestId(
      'respondents-data-summary-feedback-reviewed-reviewer-0-answers-remove',
    );

    expect(removeButton).toBeInTheDocument();

    await userEvent.click(removeButton);

    expect(screen.getByTestId('respondents-feedback-review-remove-popup')).toBeInTheDocument();

    const submitPopupButton = screen.getByTestId(
      'respondents-feedback-review-remove-popup-submit-button',
    );
    expect(submitPopupButton).toBeInTheDocument();
    await userEvent.click(submitPopupButton);

    expect(mockAxios.delete).nthCalledWith(
      1,
      `/answers/applet/${mockedAppletId}/answers/${mockedAnswerId}/assessment/review-id-2`,
      { signal: undefined },
    );

    //should be selected last assessment version on review delete
    expect(setIsLastVersion).toHaveBeenCalledWith(true);
    expect(setIsBannerVisible).toHaveBeenCalledWith(false);
    //should call setAssessment with the last assessment
    expect(setAssessment).toHaveBeenCalledWith([
      { activityItem: lastAssessment[0], answer: undefined },
    ]);

    expect(mockAxios.get).nthCalledWith(
      1,
      `/answers/applet/${mockedAppletId}/answers/${mockedAnswerId}/reviews`,
      { signal: undefined },
    );
  });

  test('should edit review', async () => {
    mockAxios.get.mockResolvedValueOnce(mockedGetWithReviews(true));
    getDecryptedActivityData();
    renderComponent(assessment, lastAssessment, false, true);

    await waitFor(() => {
      expect(mockAxios.get).nthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/answers/${mockedAnswerId}/reviews`,
        { signal: undefined },
      );
    });

    const editButton = screen.getByTestId(
      'respondents-data-summary-feedback-reviewed-reviewer-0-answers-edit',
    );

    expect(editButton).toBeInTheDocument();

    await userEvent.click(editButton);

    expect(screen.getByTestId('respondents-data-summary-feedback-assessment')).toBeInTheDocument();
  });

  test('should render empty state', async () => {
    mockAxios.get.mockResolvedValueOnce(mockedGetWithEmptyReviews);

    const getDecryptedActivityDataMock = jest.fn().mockReturnValue({
      decryptedAnswers: [],
    });

    jest
      .spyOn(dashboardHooks, 'useDecryptedActivityData')
      .mockReturnValue(getDecryptedActivityDataMock);

    renderComponent(assessment, lastAssessment, false, true);

    await waitFor(() => {
      expect(
        screen.getByTestId('respondents-data-summary-feedback-reviewed-empty-review'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('respondents-data-summary-feedback-reviewed-add-review'),
      ).toBeInTheDocument();
      expect(screen.getByText('John Doe (Me)')).toBeInTheDocument();
    });
  });
});
