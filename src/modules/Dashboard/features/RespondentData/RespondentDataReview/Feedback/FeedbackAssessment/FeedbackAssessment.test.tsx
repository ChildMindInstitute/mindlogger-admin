import { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils';
import {
  mockedApplet,
  mockedAppletId,
  mockedCurrentWorkspace,
  mockedRespondentId,
} from 'shared/mock';
import { Roles } from 'shared/consts';
import { Item, initialStateData } from 'shared/state';
import { page } from 'resources';
import { assessment, assessmentVersions, itemIds, lastAssessment } from 'shared/mock';
import * as useEncryptedAnswersHook from 'modules/Dashboard/hooks/useEncryptedAnswers';

import { getDefaultFormValues } from '../utils/getDefaultValues';
import { FeedbackAssessment } from './FeedbackAssessment';
import { RespondentDataReviewContext } from '../../RespondentDataReview.context';
import { AssessmentActivityItem } from '../../RespondentDataReview.types';
import { FeedbackForm } from '../Feedback.types';
import { FeedbackAssessmentProps } from './FeedbackAssessment.types';

const route = `/dashboard/${mockedAppletId}/respondents/${mockedRespondentId}/dataviz/responses?selectedDate=2023-11-27&answerId=0a7bcd14-24a3-48ed-8d6b-b059a6541ae4`;
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

const mockedSetItemIds = jest.fn();
const getMockedContext = (
  assessment: AssessmentActivityItem[],
  lastAssessment: Item[],
  isLastVersion: boolean,
) => ({
  assessment,
  setAssessment: jest.fn(),
  lastAssessment,
  assessmentVersions,
  isLastVersion,
  setIsLastVersion: jest.fn(),
  isBannerVisible: false,
  setIsBannerVisible: jest.fn(),
  itemIds,
  setItemIds: mockedSetItemIds,
  isFeedbackOpen: true,
});

jest.mock('modules/Dashboard/hooks/useEncryptedAnswers', () => ({
  useEncryptedAnswers: jest.fn(),
}));

jest.mock('modules/Dashboard/features/RespondentData/CollapsedMdText', () => ({
  __esModule: true,
  CollapsedMdText: jest.fn(() => (
    <div data-testid="mock-collapsed-md-text">Mocked CollapsedMdText</div>
  )),
}));

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

const mockedUserName = 'User Name (Me)';
const mockedSubmitCallback = jest.fn();
const mockedSetAssessmentStep = jest.fn();
const mockedSetIsLoading = jest.fn();
const mockedSetError = jest.fn();
const getFeedbackAssessmentComponent = ({
  assessment,
  lastAssessment,
  isLastVersion,
  props,
}: {
  assessment: AssessmentActivityItem[];
  lastAssessment: Item[];
  isLastVersion: boolean;
  props?: Partial<FeedbackAssessmentProps>;
}) => (
  <RespondentDataReviewContext.Provider
    value={getMockedContext(assessment, lastAssessment, isLastVersion)}
  >
    <FormComponent assessment={assessment}>
      <FeedbackAssessment
        assessmentStep={0}
        setAssessmentStep={mockedSetAssessmentStep}
        submitCallback={mockedSubmitCallback}
        setIsLoading={mockedSetIsLoading}
        answerId="some-answer-id"
        setError={mockedSetError}
        userName={mockedUserName}
        error={null}
        {...props}
      />
    </FormComponent>
  </RespondentDataReviewContext.Provider>
);

const renderComponent = (props?: Partial<FeedbackAssessmentProps>) => {
  renderWithProviders(
    getFeedbackAssessmentComponent({ assessment, lastAssessment, isLastVersion: true, props }),
    {
      preloadedState,
      route,
      routePath,
    },
  );
};

describe('FeedbackAssessment', () => {
  beforeEach(() => {
    jest.spyOn(useEncryptedAnswersHook, 'useEncryptedAnswers').mockReturnValue(jest.fn());
    jest.restoreAllMocks();
  });

  test('should render and the 3rd option (id: 7cdc4381-af6d-4bbb-baf7-bf4fe73448d0) is checked', () => {
    renderComponent();

    expect(screen.getByText(mockedUserName)).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();

    const multiSelect = screen.getByTestId(/multiSelect/i);
    expect(multiSelect).toBeInTheDocument();

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toEqual(3);

    const checkedCheckbox = screen.getByRole('checkbox', { checked: true }) as HTMLInputElement;
    expect(checkedCheckbox).toBeInTheDocument();

    const value = checkedCheckbox.value;
    expect(value).toEqual('7cdc4381-af6d-4bbb-baf7-bf4fe73448d0');
  });

  test('should submit assessment', async () => {
    jest.spyOn(useEncryptedAnswersHook, 'useEncryptedAnswers').mockReturnValue(jest.fn());
    renderComponent();

    await userEvent.click(screen.getByText('Submit'));

    expect(mockedSetIsLoading).toHaveBeenNthCalledWith(1, true);
    expect(mockedSetIsLoading).toHaveBeenNthCalledWith(2, false);
    expect(mockedSetItemIds).toHaveBeenCalled();
    expect(mockAxios.post).toHaveBeenCalled();
    expect(mockedSetAssessmentStep).toHaveBeenCalledWith(0);
    expect(mockedSubmitCallback).toHaveBeenCalled();
    expect(mockedSetError).not.toHaveBeenCalled();
  });

  test('set error if API call is failed on submit assessment', async () => {
    mockAxios.post.mockRejectedValue(new Error('some error'));
    renderComponent();

    await userEvent.click(screen.getByText('Submit'));

    expect(mockAxios.post).toHaveBeenCalled();
    expect(mockedSetIsLoading).toHaveBeenNthCalledWith(1, true);
    expect(mockedSetIsLoading).toHaveBeenNthCalledWith(2, false);
    expect(mockedSetItemIds).toHaveBeenCalled();
    expect(mockedSetAssessmentStep).not.toHaveBeenCalled();
    expect(mockedSubmitCallback).not.toHaveBeenCalled();
    expect(mockedSetError).toHaveBeenCalled();
  });

  test('should show error if provided', async () => {
    renderComponent({ error: 'some error' });

    expect(screen.getByText('some error')).toBeInTheDocument();
  });
});
