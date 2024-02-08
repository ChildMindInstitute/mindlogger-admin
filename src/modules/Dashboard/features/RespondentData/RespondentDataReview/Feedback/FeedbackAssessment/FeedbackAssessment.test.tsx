import { FormProvider, useForm } from 'react-hook-form';
import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';
import { mockedApplet, mockedAppletId, mockedCurrentWorkspace, mockedRespondentId } from 'shared/mock';
import { ItemResponseType, Roles } from 'shared/consts';
import { Item, initialStateData } from 'shared/state';
import { page } from 'resources';

import { getDefaultFormValues } from '../Feedback.utils';
import { FeedbackAssessment } from './FeedbackAssessment';
import { RespondentDataReviewContext } from '../../RespondentDataReview.context';
import { AssessmentActivityItem } from '../../RespondentDataReview.types';
import { FeedbackForm } from '../Feedback.types';

const route = `/dashboard/${mockedAppletId}/respondents/${mockedRespondentId}/dataviz/review?selectedDate=2023-11-27&answerId=0a7bcd14-24a3-48ed-8d6b-b059a6541ae4`;
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

const assessment = [
  {
    activityItem: {
      question: {
        en: 'ms-1',
      },
      responseType: ItemResponseType.MultipleSelection,
      responseValues: {
        options: [
          {
            id: '9858b349-32c4-4a67-830c-4a0da038a4f6',
            text: '1',
            isHidden: false,
            value: 0,
          },
          {
            id: 'bed86422-dbc6-4ab9-88f6-113f08624f53',
            text: '2',
            isHidden: false,
            value: 1,
          },
          {
            id: '7cdc4381-af6d-4bbb-baf7-bf4fe73448d0',
            text: '3',
            isHidden: false,
            value: 2,
          },
        ],
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        randomizeOptions: false,
        timer: 0,
        addScores: false,
        setAlerts: false,
        addTooltip: false,
        setPalette: false,
        addTokens: null,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
      },
      name: 'ms-1',
      isHidden: false,
      conditionalLogic: undefined,
      allowEdit: true,
      id: '1b3ad6ee-9c35-46bf-8948-0ffbcc9ca7ce',
      order: 1,
    },
    answer: {
      value: ['2'],
      edited: null,
    },
    items: [
      {
        question: {
          en: 'ms-1',
        },
        responseType: ItemResponseType.MultipleSelection,
        responseValues: {
          options: [
            {
              id: '9858b349-32c4-4a67-830c-4a0da038a4f6',
              text: '1',
              isHidden: false,
              value: 0,
            },
            {
              id: 'bed86422-dbc6-4ab9-88f6-113f08624f53',
              text: '2',
              isHidden: false,
              value: 1,
            },
            {
              id: '7cdc4381-af6d-4bbb-baf7-bf4fe73448d0',
              text: '3',
              isHidden: false,
              value: 2,
            },
          ],
        },
        config: {
          removeBackButton: false,
          skippableItem: false,
          randomizeOptions: false,
          timer: 0,
          addScores: false,
          setAlerts: false,
          addTooltip: false,
          setPalette: false,
          addTokens: null,
          additionalResponseOption: {
            textInputOption: false,
            textInputRequired: false,
          },
        },
        name: 'ms-1',
        isHidden: false,
        conditionalLogic: undefined,
        allowEdit: true,
        id: '1b3ad6ee-9c35-46bf-8948-0ffbcc9ca7ce',
        order: 1,
      },
    ],
  },
] as AssessmentActivityItem[];
const lastAssessment = [
  {
    question: {
      en: 'slider-1',
    },
    responseType: ItemResponseType.Slider,
    responseValues: {
      minLabel: 'min',
      maxLabel: 'max',
      minValue: 0,
      maxValue: 5,
    },
    config: {
      removeBackButton: false,
      skippableItem: false,
      addScores: false,
      setAlerts: false,
      additionalResponseOption: {
        textInputOption: false,
        textInputRequired: false,
      },
      showTickMarks: true,
      showTickLabels: true,
      continuousSlider: false,
      timer: 0,
    },
    name: 'slider-1',
    isHidden: false,
    conditionalLogic: undefined,
    allowEdit: true,
    id: 'd56e3695-bf8f-449f-ab1a-f395a9d9645d',
    order: 1,
  },
] as Item[];
const assessmentVersions = ['316b25bf-5136-404f-b9f0-c97f60cf8d74_1.1.0', '316b25bf-5136-404f-b9f0-c97f60cf8d74_1.2.0'];
const itemIds = ['1b3ad6ee-9c35-46bf-8948-0ffbcc9ca7ce'];

const setIsLastVersion = jest.fn();
const setIsBannerVisible = jest.fn();

const getMockedContext = (
  assessment: AssessmentActivityItem[],
  lastAssessment: Item[],
  isLastVersion: boolean,
  isBannerVisible: boolean,
) => ({
  assessment,
  setAssessment: jest.fn(),
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

jest.mock('modules/Dashboard/hooks/useEncryptedAnswers', () => ({
  useEncryptedAnswers: jest.fn(),
}));

jest.mock('modules/Dashboard/features/RespondentData/CollapsedMdText', () => ({
  __esModule: true,
  CollapsedMdText: jest.fn(() => <div data-testid="mock-collapsed-md-text">Mocked CollapsedMdText</div>),
}));

const FormComponent = ({
  children,
  assessment,
}: {
  children: React.ReactNode;
  assessment: AssessmentActivityItem[];
}) => {
  const methods = useForm<FeedbackForm>({
    defaultValues: getDefaultFormValues(assessment),
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

const getFeedbackAssessmentComponent = (
  assessment: AssessmentActivityItem[],
  lastAssessment: Item[],
  isLastVersion: boolean,
  isBannerVisible: boolean,
) => (
  <RespondentDataReviewContext.Provider
    value={getMockedContext(assessment, lastAssessment, isLastVersion, isBannerVisible)}>
    <FormComponent assessment={assessment}>
      <FeedbackAssessment setActiveTab={jest.fn()} assessmentStep={0} setAssessmentStep={jest.fn()} />
    </FormComponent>
  </RespondentDataReviewContext.Provider>
);

describe('FeedbackAssessment', () => {
  test('banner should be visible', () => {
    renderWithProviders(getFeedbackAssessmentComponent(assessment, lastAssessment, false, true), {
      preloadedState,
      route,
      routePath,
    });

    const banner = screen.getByTestId('assessment-banner');
    const height = getComputedStyle(banner).getPropertyValue('height');
    expect(height).toEqual('auto');
  });

  test('banner should not be visible', () => {
    renderWithProviders(getFeedbackAssessmentComponent(assessment, lastAssessment, false, false), {
      preloadedState,
      route,
      routePath,
    });

    const banner = screen.getByTestId('assessment-banner');
    const height = parseInt(getComputedStyle(banner).getPropertyValue('height'), 10);
    expect(height).toEqual(0);
  });

  test('should be checked the 3rd option (id: 7cdc4381-af6d-4bbb-baf7-bf4fe73448d0)', () => {
    renderWithProviders(getFeedbackAssessmentComponent(assessment, lastAssessment, false, true), {
      preloadedState,
      route,
      routePath,
    });

    const multiSelect = screen.getByTestId(/multiSelect/i);
    expect(multiSelect).toBeInTheDocument();

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toEqual(3);

    const checkedCheckbox = screen.getByRole('checkbox', { checked: true }) as HTMLInputElement;
    expect(checkedCheckbox).toBeInTheDocument();

    const value = checkedCheckbox.value;
    expect(value).toEqual('7cdc4381-af6d-4bbb-baf7-bf4fe73448d0');
  });

  test('should be selected last assessment version', async () => {
    renderWithProviders(getFeedbackAssessmentComponent(assessment, lastAssessment, false, true), {
      preloadedState,
      route,
      routePath,
    });

    fireEvent.click(screen.getByTestId('assessment-banner-button'));

    expect(setIsLastVersion).toHaveBeenCalledWith(true);
    expect(setIsBannerVisible).toHaveBeenCalledWith(false);
  });
});
