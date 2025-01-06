import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { v4 as uuid } from 'uuid';

import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';
import { mockedAppletId, mockedSingleSelectFormValues, mockedSliderFormValues } from 'shared/mock';
import { CalculationType, ScoreReportType, SubscaleTotalScore } from 'shared/consts';
import {
  ActivityFormValues,
  AppletFormValues,
  ItemFormValuesCommonType,
} from 'modules/Builder/types';
import {
  ActivitySettingsSubscale,
  SingleAndMultipleSelectItemResponseValues,
  SingleSelectItem,
} from 'shared/state';
import { getEntityKey } from 'shared/utils';
import { useCurrentActivity } from 'modules/Builder/hooks';

import { ScoreContent } from './ScoreContent';
import { ScoreContentProps } from './ScoreContent.types';

const items = [
  {
    id: mockedSingleSelectFormValues.id,
    name: mockedSingleSelectFormValues.name,
    question: mockedSingleSelectFormValues.question,
  },
  {
    id: mockedSliderFormValues.id,
    name: mockedSliderFormValues.name,
    question: mockedSliderFormValues.question,
  },
];

const scoreItems = [mockedSingleSelectFormValues, mockedSliderFormValues];

const tableItems = [
  {
    id: mockedSingleSelectFormValues.id,
    name: mockedSingleSelectFormValues.name,
    tooltip: mockedSingleSelectFormValues.question,
    label: `${mockedSingleSelectFormValues.name}: ${mockedSingleSelectFormValues.question}`,
  },
  {
    id: mockedSliderFormValues.id,
    name: mockedSliderFormValues.name,
    tooltip: mockedSliderFormValues.question,
    label: `${mockedSliderFormValues.name}: ${mockedSliderFormValues.question}`,
  },
];

const dataTestid = 'report-score-content-name';
const currentActivityIndex = '0';
const fieldName = `activities.${currentActivityIndex}`;

const commonProps: ScoreContentProps = {
  name: `${fieldName}.scoresAndReports.reports.0`,
  title: 'Score 1',
  index: 0,
  items,
  tableItems,
  scoreItems,
  isStaticActive: false,
  'data-testid': dataTestid,
};

const activity: ActivityFormValues = {
  id: uuid(),
  name: 'New Activity#1',
  description: '',
  items: [],
  scoresAndReports: {
    generateReport: true,
    showScoreSummary: true,
    reports: [
      {
        type: ScoreReportType.Score,
        scoringType: 'raw_score',
        name: 'score1',
        id: 'sumScore_score1',
        calculationType: CalculationType.Sum,
        itemsScore: [mockedSingleSelectFormValues.id],
        message: 'score1',
        itemsPrint: [],
        key: '342a5c93-4c6c-443f-83e9-8b7d517c24ad',
        showMessage: true,
        printItems: false,
      },
    ],
  },
};

const formValues: AppletFormValues = {
  displayName: '',
  description: '',
  about: '',
  image: '',
  watermark: '',
  activities: [activity],
  activityFlows: [],
  streamEnabled: false,
  streamIpAddress: null,
  streamPort: null,
};

const mockUseNavigate = jest.fn();
const mockUseParams = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
  useParams: () => mockUseParams(),
}));

jest.mock('modules/Builder/hooks', () => ({
  ...jest.requireActual('modules/Builder/hooks'),
  useCurrentActivity: jest.fn(),
}));

const mockUseCurrentActivity = jest.mocked(useCurrentActivity);

describe('ScoreContent', () => {
  beforeEach(() => {
    mockUseCurrentActivity.mockReturnValue({
      fieldName,
      activity,
      activityObjField: `activities[${currentActivityIndex}]`,
    });
    mockUseParams.mockReturnValue({
      appletId: mockedAppletId,
      activityId: activity.id,
    });
    mockUseNavigate.mockClear();
  });

  test('should render score', () => {
    renderWithAppletFormData({ children: <ScoreContent {...commonProps} /> });

    expect(screen.getByTestId(dataTestid)).toBeInTheDocument();
  });

  test.each`
    scoreItems                | expectedResult   | description
    ${commonProps.scoreItems} | ${'1.00 ~ 2.00'} | ${'should render filled in score range if scoreItems is provided'}
    ${[]}                     | ${'-'}           | ${'should render empty score range if scoreItems is empty list'}
    ${undefined}              | ${'-'}           | ${'should render empty score range if scoreItems is undefined'}
  `('$description', async ({ scoreItems, expectedResult }) => {
    renderWithAppletFormData({
      children: <ScoreContent {...commonProps} scoreItems={scoreItems} />,
      appletFormData: formValues,
    });
    expect(screen.getByTestId(`${dataTestid}-score-range`)).toHaveTextContent(expectedResult);
  });

  test('score type radio group should be hidden by default', async () => {
    const { queryByTestId } = renderWithAppletFormData({
      children: <ScoreContent {...commonProps} tableItems={[]} scoreItems={[]} />,
    });

    expect(queryByTestId(`${dataTestid}-score-type-toggle`)).toBeNull();
  });

  test('score type radio group is hidden with ineligible subscales', async () => {
    const subscaleWithoutLookupTable: ActivitySettingsSubscale<string> = {
      id: 'sum-subscale',
      name: 'Sum subscale',
      items: [getEntityKey(mockedSingleSelectFormValues)],
      scoring: SubscaleTotalScore.Sum,

      // No lookup table
      subscaleTableData: null,
    };

    const parentSubscale: ActivitySettingsSubscale<string> = {
      name: 'Parent subscale',

      // Has a lookup table, but contains only nested subscales
      items: [getEntityKey(subscaleWithoutLookupTable)],
      scoring: SubscaleTotalScore.Sum,
      subscaleTableData: [
        {
          id: 'row-1',
          score: '50',
          rawScore: '5~10',
          optionalText: '',
          age: '16',
          sex: 'M',
          severity: null,
        },
      ],
    };

    const { queryByTestId } = renderWithAppletFormData({
      children: <ScoreContent {...commonProps} tableItems={[]} scoreItems={[]} />,
      appletFormData: {
        ...formValues,
        activities: [
          {
            ...activity,
            subscaleSetting: {
              calculateTotalScore: null,
              subscales: [subscaleWithoutLookupTable, parentSubscale],
              totalScoresTableData: null,
            },
          },
        ],
      },
    });

    expect(queryByTestId(`${dataTestid}-score-type-toggle`)).toBeNull();
  });

  test('score type radio group defaults to raw score with eligible subscales', async () => {
    const sumSubscale: ActivitySettingsSubscale<string> = {
      id: 'sum-subscale',
      name: 'Sum subscale',
      items: [getEntityKey(mockedSingleSelectFormValues)],
      scoring: SubscaleTotalScore.Sum,
      subscaleTableData: [
        {
          id: 'row-1',
          score: '50',
          rawScore: '5~10',
          optionalText: '',
          age: '16',
          sex: 'M',
          severity: null,
        },
      ],
    };

    const activityWithSubscaleSetting: ActivityFormValues = {
      ...activity,
      subscaleSetting: {
        calculateTotalScore: null,
        subscales: [sumSubscale],
        totalScoresTableData: null,
      },
    };

    mockUseCurrentActivity.mockReturnValue({
      fieldName,
      activity: activityWithSubscaleSetting,
      activityObjField: `activities[${currentActivityIndex}]`,
    });

    const { findByTestId } = renderWithAppletFormData({
      children: <ScoreContent {...commonProps} />,
      appletFormData: {
        ...formValues,
        activities: [activityWithSubscaleSetting],
      },
    });

    const scoreTypeRadioGroup = await findByTestId(`${dataTestid}-score-type-toggle`);
    expect(scoreTypeRadioGroup).not.toBeNull();
    const radios = within(scoreTypeRadioGroup).getAllByRole<HTMLInputElement>('radio');
    const selected = radios.find((radio) => radio.checked);
    expect(selected).not.toBeUndefined();
    expect(selected?.value).toEqual('raw_score');
  });

  test('should offer only eligible subscales to be linked', async () => {
    const sumSubscale: ActivitySettingsSubscale<string> = {
      id: 'sum-subscale',
      name: 'Sum subscale',
      items: [getEntityKey(mockedSingleSelectFormValues)],
      scoring: SubscaleTotalScore.Sum,
      subscaleTableData: [
        {
          id: 'row-1',
          score: '50',
          rawScore: '5~10',
          optionalText: '',
          age: '16',
          sex: 'M',
          severity: null,
        },
      ],
    };

    const subscaleWithoutLookupTable: ActivitySettingsSubscale<string> = {
      id: 'subscale-wo-lookup-table',
      name: 'Sum subscale',
      items: [getEntityKey(mockedSingleSelectFormValues)],
      scoring: SubscaleTotalScore.Sum,

      // No lookup table
      subscaleTableData: null,
    };

    const subscaleWithNoActivityItems: ActivitySettingsSubscale<string> = {
      id: 'subscale-with-no-activity-items',
      name: 'Parent subscale',

      // Has a lookup table, but contains only nested subscales
      items: [getEntityKey(subscaleWithoutLookupTable)],
      scoring: SubscaleTotalScore.Sum,
      subscaleTableData: [
        {
          id: 'row-1',
          score: '50',
          rawScore: '5~10',
          optionalText: '',
          age: '16',
          sex: 'M',
          severity: null,
        },
      ],
    };

    const activityWithSubscaleSetting: ActivityFormValues = {
      ...activity,
      subscaleSetting: {
        calculateTotalScore: null,
        subscales: [sumSubscale, subscaleWithoutLookupTable, subscaleWithNoActivityItems],
        totalScoresTableData: null,
      },
    };

    mockUseCurrentActivity.mockReturnValue({
      fieldName,
      activity: activityWithSubscaleSetting,
      activityObjField: `activities[${currentActivityIndex}]`,
    });

    const { findByTestId, findAllByRole } = renderWithAppletFormData({
      children: <ScoreContent {...commonProps} />,
      appletFormData: {
        ...formValues,
        activities: [activityWithSubscaleSetting],
      },
    });

    const scoreTypeRadioGroup = await findByTestId(`${dataTestid}-score-type-toggle`);

    // Change the scoring type to 'Score'
    await userEvent.click(within(scoreTypeRadioGroup).getByLabelText('Score'));

    const dropdown = await findByTestId(`${dataTestid}-linked-subscale`);
    await userEvent.click(within(dropdown).getByRole('button'));

    const options = await findAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0].textContent).toEqual(sumSubscale.name);
  });

  test.each`
    subscaleScoringType           | expectedCalculationType | expectedScoreRange
    ${SubscaleTotalScore.Sum}     | ${'Sum'}                | ${'10.00 ~ 90.00'}
    ${SubscaleTotalScore.Average} | ${'Average'}            | ${'10.00 ~ 50.00'}
  `(
    'calculation type and score range should reflect linked subscale ($expectedCalculationType)',
    async ({
      subscaleScoringType,
      expectedCalculationType,
      expectedScoreRange,
    }: {
      subscaleScoringType: SubscaleTotalScore;
      expectedCalculationType: string;
      expectedScoreRange: string;
    }) => {
      const getResponseValues = (): SingleAndMultipleSelectItemResponseValues => ({
        options: [
          {
            id: uuid(),
            text: 'Option 1',
            score: 20,
            value: 0,
          },
          {
            id: uuid(),
            text: 'Option 2',
            score: 25,
            value: 1,
          },
          {
            id: uuid(),
            text: 'Option 3',
            score: 30,
            value: 2,
          },
        ],
      });

      const singleSelectItem1: Omit<SingleSelectItem<ItemFormValuesCommonType>, 'id'> & {
        id: string;
      } = {
        ...mockedSingleSelectFormValues,
        id: uuid(),
        order: 1,
        responseValues: getResponseValues(),
      };

      const singleSelectItem2: Omit<SingleSelectItem<ItemFormValuesCommonType>, 'id'> & {
        id: string;
      } = {
        ...mockedSingleSelectFormValues,
        id: uuid(),
        order: 2,
        responseValues: getResponseValues(),
      };

      const singleSelectItem3: Omit<SingleSelectItem<ItemFormValuesCommonType>, 'id'> & {
        id: string;
      } = {
        ...mockedSingleSelectFormValues,
        id: uuid(),
        order: 2,
        responseValues: getResponseValues(),
      };

      const sumSubscale: ActivitySettingsSubscale<string> = {
        id: `${subscaleScoringType}-subscale`,
        name: `${expectedCalculationType} subscale`,
        items: [
          getEntityKey(singleSelectItem1),
          getEntityKey(singleSelectItem2),
          getEntityKey(singleSelectItem3),
        ],
        scoring: subscaleScoringType,
        subscaleTableData: [
          {
            id: `row-1`,
            score: '10',
            rawScore: '1',
            optionalText: '',
            age: '15',
            sex: 'M',
            severity: null,
          },
          {
            id: `row-2`,
            score: '20',
            rawScore: '2',
            optionalText: '',
            age: '15',
            sex: 'M',
            severity: null,
          },
          {
            id: `row-3`,
            score: '30',
            rawScore: '3',
            optionalText: '',
            age: '15',
            sex: 'M',
            severity: null,
          },
          {
            id: `row-4`,
            score: '40',
            rawScore: '4',
            optionalText: '',
            age: '15',
            sex: 'M',
            severity: null,
          },
          {
            id: `row-5`,
            score: '50',
            rawScore: '5',
            optionalText: '',
            age: '15',
            sex: 'M',
            severity: null,
          },
        ],
      };

      const activityWithSubscaleSetting: ActivityFormValues = {
        ...activity,
        items: [singleSelectItem1, singleSelectItem2, singleSelectItem3],
        subscaleSetting: {
          calculateTotalScore: null,
          subscales: [sumSubscale],
          totalScoresTableData: null,
        },
      };

      mockUseCurrentActivity.mockReturnValue({
        fieldName,
        activity: activityWithSubscaleSetting,
        activityObjField: `activities[${currentActivityIndex}]`,
      });

      const { findByTestId, findByRole } = renderWithAppletFormData({
        children: (
          <ScoreContent
            {...commonProps}
            scoreItems={[singleSelectItem1, singleSelectItem2, singleSelectItem3]}
          />
        ),
        appletFormData: {
          ...formValues,
          activities: [activityWithSubscaleSetting],
        },
      });

      const scoreTypeRadioGroup = await findByTestId(`${dataTestid}-score-type-toggle`);

      // Change the scoring type to 'Score'
      await userEvent.click(within(scoreTypeRadioGroup).getByLabelText('Score'));
      const dropdown = await findByTestId(`${dataTestid}-linked-subscale`);
      await userEvent.click(within(dropdown).getByRole('button'));

      // Select the subscale from the dropdown
      const option = await findByRole('option');
      await userEvent.click(option);

      await findByTestId(`${dataTestid}-view-subscales-configuration`);

      const calculationType = await findByTestId(`${dataTestid}-calculation-type`);
      expect(within(calculationType).getByRole('button').textContent).toEqual(
        expectedCalculationType,
      );

      // The calculation type selection is fixed
      const input = calculationType.querySelector('input');
      expect(input).not.toBeNull();
      expect(input?.disabled).toEqual(true);

      const scoreRange = await findByTestId(`${dataTestid}-score-range`);
      expect(scoreRange.textContent).toEqual(expectedScoreRange);
    },
  );

  test('should navigate to subscales screen when view subscales configuration button is pressed', async () => {
    const sumSubscale: ActivitySettingsSubscale<string> = {
      id: `$sum-subscale`,
      name: `Sum subscale`,
      items: [getEntityKey(mockedSingleSelectFormValues)],
      scoring: SubscaleTotalScore.Sum,
      subscaleTableData: [
        {
          id: `row-1`,
          score: '50',
          rawScore: '5~10',
          optionalText: '',
          age: '15',
          sex: 'M',
          severity: null,
        },
      ],
    };

    const activityWithSubscaleSetting: ActivityFormValues = {
      ...activity,
      items: [mockedSingleSelectFormValues],
      subscaleSetting: {
        calculateTotalScore: null,
        subscales: [sumSubscale],
        totalScoresTableData: null,
      },
    };

    mockUseCurrentActivity.mockReturnValue({
      fieldName,
      activity: activityWithSubscaleSetting,
      activityObjField: `activities[${currentActivityIndex}]`,
    });

    const { findByTestId, findByRole } = renderWithAppletFormData({
      children: <ScoreContent {...commonProps} />,
      appletFormData: {
        ...formValues,
        activities: [activityWithSubscaleSetting],
      },
    });

    const scoreTypeRadioGroup = await findByTestId(`${dataTestid}-score-type-toggle`);

    // Change the scoring type to 'Score'
    await userEvent.click(within(scoreTypeRadioGroup).getByLabelText('Score'));
    const dropdown = await findByTestId(`${dataTestid}-linked-subscale`);
    await userEvent.click(within(dropdown).getByRole('button'));

    // Select the subscale from the dropdown
    const option = await findByRole('option');
    await userEvent.click(option);

    const viewSubscalesConfigBtn = await findByTestId(`${dataTestid}-view-subscales-configuration`);
    await userEvent.click(viewSubscalesConfigBtn);

    expect(mockUseNavigate).toBeCalledWith(
      `/builder/${mockedAppletId}/activities/${activityWithSubscaleSetting.id}/settings/subscales-configuration`,
    );
  });

  describe('scoreId should change when calculation type changes', () => {
    test.each`
      calculationType               | expectedResult               | description
      ${CalculationType.Sum}        | ${'sumScore_firstscore'}     | ${'for sum type should be sumScore_firstscore'}
      ${CalculationType.Average}    | ${'averageScore_firstscore'} | ${'for average type should be averageScore_firstscore'}
      ${CalculationType.Percentage} | ${'percentScore_firstscore'} | ${'for percentage type should be percentScore_firstscore'}
    `('$description', async ({ calculationType, expectedResult }) => {
      const { getByTestId, findByTestId } = renderWithAppletFormData({
        children: <ScoreContent {...commonProps} />,
      });

      const selectWrapper = getByTestId(`${dataTestid}-calculation-type`);
      const input = selectWrapper.querySelector('input');
      input && fireEvent.change(input, { target: { value: calculationType } });

      // Check if the change score ID popup is showing
      try {
        const changeScoreIdPopup = await findByTestId(`${dataTestid}-change-score-id-popup`);
        const submitBtn = within(changeScoreIdPopup).getByTestId(
          `${dataTestid}-change-score-id-popup-submit-button`,
        );
        await userEvent.click(submitBtn);

        const retryOkBtn = within(changeScoreIdPopup).getByTestId(
          `${dataTestid}-change-score-id-popup-submit-button`,
        );
        expect(retryOkBtn.textContent).toBe('Ok');
        await userEvent.click(retryOkBtn);
      } catch {
        // If it's not showing, that's fine
      }

      await waitFor(() =>
        expect(screen.getByTestId(`${dataTestid}-scoreid`)).toHaveTextContent(expectedResult),
      );
    });
  });

  describe('range of scores should change when change select items', () => {
    test.each`
      checkboxIndexes | expectedResult   | description
      ${[0]}          | ${'1.00 ~ 2.00'} | ${'should be 1.00 ~ 2.00'}
      ${[1]}          | ${'1.00 ~ 4.00'} | ${'should be 1.00 ~ 4.00'}
      ${[0, 1]}       | ${'2.00 ~ 6.00'} | ${'should be 2.00 ~ 6.00'}
      ${[]}           | ${'-'}           | ${'should be -'}
    `(
      '$description',
      async ({
        checkboxIndexes,
        expectedResult,
      }: {
        checkboxIndexes: number[];
        expectedResult: string;
      }) => {
        renderWithAppletFormData({ children: <ScoreContent {...commonProps} /> });

        checkboxIndexes.forEach((index) => {
          const checkboxWrapper = screen.getByTestId(
            `${dataTestid}-items-score-unselected-checkbox-${index}`,
          );
          fireEvent.click(within(checkboxWrapper).getByRole('checkbox'));
        });

        await waitFor(() =>
          expect(screen.getByTestId(`${dataTestid}-score-range`)).toHaveTextContent(expectedResult),
        );
      },
    );
  });

  test('should change scoreId when score name changes', () => {
    renderWithAppletFormData({ children: <ScoreContent {...commonProps} /> });

    const nameInput = screen.getByTestId(`${dataTestid}-name`);
    const input = nameInput.querySelector('input');
    input && fireEvent.change(input, { target: { value: 'secondScore' } });

    expect(input?.value).toBe('secondScore');
  });

  test('should remove conditional logic', () => {
    renderWithAppletFormData({ children: <ScoreContent {...commonProps} /> });

    fireEvent.click(screen.getByTestId(`${dataTestid}-conditional-0-remove`));

    const removePopup = screen.getByTestId(`${dataTestid}-remove-conditional-logic-popup`);
    expect(removePopup).toBeInTheDocument();

    fireEvent.click(within(removePopup).getByText('Remove'));

    expect(
      within(removePopup).getByText('Conditional logic has been removed successfully.'),
    ).toBeInTheDocument();

    fireEvent.click(within(removePopup).getByText('Ok'));

    expect(
      screen.queryByTestId(`${dataTestid}-remove-conditional-logic-popup`),
    ).not.toBeInTheDocument();
  });

  test('should add conditional logic', () => {
    renderWithAppletFormData({ children: <ScoreContent {...commonProps} /> });

    fireEvent.click(screen.getByTestId(`${dataTestid}-add-score-conditional`));

    expect(screen.getByTestId(`${dataTestid}-conditional-1`)).toBeInTheDocument();
  });
});
