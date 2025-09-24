// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef, RefObject } from 'react';
import { generatePath } from 'react-router-dom';
import { v4 as uuidv4, v4 as uuid } from 'uuid';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { setMockLookupTableFileData } from '__mocks__/LookupTableUploader';
import userEvent from '@testing-library/user-event';

import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { page } from 'resources';
import {
  mockedAppletFormData,
  mockedAudioActivityItem,
  mockedAudioPlayerActivityItem,
  mockedDateActivityItem,
  mockedDrawingActivityItem,
  mockedMessageActivityItem,
  mockedMultiActivityItem,
  mockedMultiSelectRowsActivityItem,
  mockedNumberSelectActivityItem,
  mockedParagraphTextActivityItem,
  mockedPhotoActivityItem,
  mockedPhrasalTemplateActivityItem,
  mockedSingleActivityItem,
  mockedSingleSelectRowsActivityItem,
  mockedSliderActivityItem,
  mockedSliderRowsActivityItem,
  mockedTextActivityItem,
  mockedTimeActivityItem,
  mockedTimeRangeActivityItem,
  mockedVideoActivityItem,
} from 'shared/mock';
import { getEntityKey, isSystemItem, SettingParam } from 'shared/utils';
import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';
import {
  CalculationType,
  LookupTableItems,
  ScoreReportType,
  SubscaleTotalScore,
} from 'shared/consts';
import { AppletFormValues, ItemFormValues } from 'modules/Builder/types';
import { ScoreReport } from 'shared/state';

import { SubscalesConfiguration } from './SubscalesConfiguration';

const mockedTestid = 'builder-activity-settings-subscales';

const mockedSingleActivityItemWithoutScores = {
  ...mockedSingleActivityItem,
  id: uuidv4(),
  name: `${mockedSingleActivityItem.name}_no_scores`,
  responseValues: {
    ...mockedSingleActivityItem.responseValues,
    options: mockedSingleActivityItem.responseValues.options.map((option) => ({
      ...option,
      score: undefined,
    })),
  },
  config: {
    ...mockedSingleActivityItem.config,
    addScores: false,
  },
};
const mockedMultiActivityItemWithoutScores = {
  ...mockedMultiActivityItem,
  id: uuidv4(),
  name: `${mockedMultiActivityItem.name}_no_scores`,
  responseValues: {
    ...mockedMultiActivityItem.responseValues,
    options: mockedMultiActivityItem.responseValues.options.map((option) => ({
      ...option,
      score: undefined,
    })),
  },
  config: {
    ...mockedMultiActivityItem.config,
    addScores: false,
  },
};
const mockedSliderActivityItemWithoutScores = {
  ...mockedSliderActivityItem,
  id: uuidv4(),
  name: `${mockedSliderActivityItem.name}_no_scores`,
  responseValues: {
    ...mockedSliderActivityItem.responseValues,
    scores: undefined,
  },
  config: {
    ...mockedSliderActivityItem.config,
    addScores: false,
  },
};
const mockedAvailableItems = [
  mockedSingleActivityItem,
  mockedMultiActivityItem,
  mockedSliderActivityItem,
];

const mockedAppletWithAllItemTypes = {
  ...mockedAppletFormData,
  activities: [
    {
      ...mockedAppletFormData.activities[0],
      items: [
        mockedSingleActivityItem,
        mockedMultiActivityItem,
        mockedDateActivityItem,
        mockedTextActivityItem,
        mockedTimeActivityItem,
        mockedAudioActivityItem,
        mockedPhotoActivityItem,
        mockedVideoActivityItem,
        mockedSliderActivityItem,
        mockedDrawingActivityItem,
        mockedMessageActivityItem,
        mockedTimeRangeActivityItem,
        mockedSliderRowsActivityItem,
        mockedAudioPlayerActivityItem,
        mockedNumberSelectActivityItem,
        mockedMultiSelectRowsActivityItem,
        mockedSingleSelectRowsActivityItem,
        mockedSingleActivityItemWithoutScores,
        mockedMultiActivityItemWithoutScores,
        mockedSliderActivityItemWithoutScores,
        mockedPhrasalTemplateActivityItem,
        mockedParagraphTextActivityItem,
      ],
    },
  ],
};
const mockedAppletWithGenderAndAgeNonSystemItems = {
  ...mockedAppletFormData,
  activities: [
    {
      ...mockedAppletFormData.activities[0],
      items: [
        {
          ...mockedSingleActivityItem,
          name: 'gender_screen',
        },
        {
          ...mockedMultiActivityItem,
          name: 'age_screen',
        },
      ],
    },
  ],
};

const renderSubscales = (formData = mockedAppletWithAllItemTypes) => {
  const ref = createRef<ReturnType<typeof useForm>>();

  renderWithAppletFormData({
    appletFormData: formData,
    children: <SubscalesConfiguration />,
    formRef: ref,
    options: {
      routePath: page.builderAppletActivitySettingsItem,
      route: generatePath(page.builderAppletActivitySettingsItem, {
        appletId: formData.id,
        activityId: formData.activities[0].id,
        setting: SettingParam.SubscalesConfiguration,
      }),
    },
  });

  return ref;
};

const addSubscale = () => {
  fireEvent.click(screen.getByTestId(`${mockedTestid}-add`));
};

const setUpLookupTable = async (
  formData = mockedAppletWithAllItemTypes,
): Promise<RefObject<ReturnType<typeof useForm>>> => {
  const ref = renderSubscales(formData);

  addSubscale();

  fireEvent.click(screen.getByTestId(`${mockedTestid}-0-lookup-table`));

  expect(screen.getByTestId(`${mockedTestid}-0-lookup-table-popup`)).toBeVisible();

  await waitFor(() => {
    screen.getByText('Your Lookup Table for was parsed successfully.');
  });

  fireEvent.click(screen.getByTestId(`${mockedTestid}-0-lookup-table-popup-submit-button`));

  return ref;
};

jest.mock('shared/components/FileUploader/FileUploader', () => ({
  ...jest.requireActual('__mocks__/LookupTableUploader'),
}));

jest.mock('shared/hooks/useFeatureFlags', () => ({
  useFeatureFlags: jest.fn(),
}));

const mockUseFeatureFlags = jest.mocked(useFeatureFlags);

describe('SubscalesConfiguration', () => {
  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableCahmiSubscaleScoring: false,
      },
      resetLDContext: jest.fn(),
    });
  });

  test('Default Empty Page', () => {
    renderSubscales();

    expect(screen.getByTestId(`${mockedTestid}-add`)).toBeVisible();
    expect(screen.queryAllByTestId(new RegExp(`^${mockedTestid}-\\d+$`))).toHaveLength(0);
    expect(
      screen.queryByTestId(`${mockedTestid}-elements-associated-with-subscales`),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId(`${mockedTestid}-calculate-total-score`)).not.toBeInTheDocument();
  });

  test('Add/Remove works correctly', () => {
    renderSubscales();

    addSubscale();
    expect(screen.queryAllByTestId(new RegExp(`^${mockedTestid}-\\d+$`))).toHaveLength(1);
    addSubscale();
    expect(screen.queryAllByTestId(new RegExp(`^${mockedTestid}-\\d+$`))).toHaveLength(2);

    fireEvent.click(screen.getByTestId(`${mockedTestid}-1-remove`));
    expect(screen.queryAllByTestId(new RegExp(`^${mockedTestid}-\\d+$`))).toHaveLength(1);
    fireEvent.click(screen.getByTestId(`${mockedTestid}-0-remove`));
    expect(screen.queryAllByTestId(new RegExp(`^${mockedTestid}-\\d+$`))).toHaveLength(0);
  });

  test('Default Page with added Subscale', () => {
    renderSubscales();

    addSubscale();

    [
      `${mockedTestid}-0-lookup-table`,
      `${mockedTestid}-0-remove`,
      `${mockedTestid}-0-name`,
      `${mockedTestid}-0-scoring`,
      `${mockedTestid}-0-items-unselected`,
      `${mockedTestid}-0-unused-items`,
      `${mockedTestid}-elements-associated-with-subscales`,
      `${mockedTestid}-calculate-total-score`,
    ].forEach((testId) => {
      expect(screen.getByTestId(testId)).toBeVisible();
    });
  });

  test('Items available for selecting in Subscale', async () => {
    renderSubscales();

    addSubscale();

    const itemsToSelect = screen
      .getByTestId(`${mockedTestid}-0-items-unselected`)
      .querySelectorAll('tbody tr');
    expect(itemsToSelect).toHaveLength(3);

    itemsToSelect.forEach((item, index) => {
      const selectedItem = mockedAvailableItems[index];
      expect(item).toHaveTextContent(`Item: ${selectedItem.name}: ${selectedItem.question}`);
    });

    addSubscale();
    const newItemsToSelect = screen
      .getByTestId(`${mockedTestid}-0-items-unselected`)
      .querySelectorAll('tbody tr');
    expect(newItemsToSelect).toHaveLength(4);
    expect(newItemsToSelect[0]).toHaveTextContent('Subscale: ()');

    fireEvent.change(screen.getByTestId(`${mockedTestid}-1-name`).querySelector('input'), {
      target: { value: 'subscale_2' },
    });
    // wait for debounce callback
    await waitFor(() => {
      expect(newItemsToSelect[0]).toHaveTextContent('Subscale: subscale_2 ()');
    });
  });

  test('Elements Associated works correctly', async () => {
    renderSubscales();

    addSubscale();
    addSubscale();

    fireEvent.change(screen.getByTestId(`${mockedTestid}-0-name`).querySelector('input'), {
      target: { value: 'subscale_1' },
    });
    fireEvent.change(screen.getByTestId(`${mockedTestid}-1-name`).querySelector('input'), {
      target: { value: 'subscale_2' },
    });

    // Wait for both subscale names to be updated in the header (debounce complete)
    await waitFor(
      () => {
        const header0 = screen.getByTestId(`${mockedTestid}-0-header`);
        const header1 = screen.getByTestId(`${mockedTestid}-1-header`);
        expect(header0).toHaveTextContent('Subscale 1: subscale_1');
        expect(header1).toHaveTextContent('Subscale 2: subscale_2');
      },
      { timeout: 1500 },
    );

    fireEvent.click(
      screen.getByTestId(`${mockedTestid}-0-items-unselected-checkbox-0`).querySelector('input'),
    );
    fireEvent.click(
      screen.getByTestId(`${mockedTestid}-1-items-unselected-checkbox-0`).querySelector('input'),
    );

    const elementsAssociated = screen
      .getByTestId(`${mockedTestid}-elements-associated-with-subscales`)
      .querySelectorAll('tbody tr');

    expect(elementsAssociated).toHaveLength(2);

    const [associatedSubscale, associatedItem] = elementsAssociated;
    const [associatedSubscaleElement, associatedSubscaleSubscale] =
      associatedSubscale.querySelectorAll('td');
    const [associatedItemElement, associatedItemSubscale] = associatedItem.querySelectorAll('td');

    // wait for debounce callback and validation to complete
    await waitFor(
      () => {
        expect(associatedSubscaleElement).toHaveTextContent(
          'Subscale: subscale_2 (Item: single_text_score)',
        );
      },
      { timeout: 1500 },
    );

    expect(associatedSubscaleSubscale).toHaveTextContent('subscale_1');

    expect(associatedItemElement).toHaveTextContent('Item: single_text_score');
    expect(associatedItemSubscale).toHaveTextContent('subscale_2');
  });

  test('Calculate Total Score works correctly', () => {
    renderSubscales();

    addSubscale();

    const calculateTotalScoreSwitch = screen.getByTestId(`${mockedTestid}-calculate-total-score`);
    expect(calculateTotalScoreSwitch.querySelector('.MuiSwitch-switchBase')).not.toHaveClass(
      'Mui-checked',
    );
    fireEvent.click(calculateTotalScoreSwitch.querySelector('input'));
    expect(calculateTotalScoreSwitch.querySelector('.MuiSwitch-switchBase')).toHaveClass(
      'Mui-checked',
    );

    const sumOfScores = screen.getByTestId(`${mockedTestid}-calculate-total-score-value-0`);
    const averageOfScores = screen.getByTestId(`${mockedTestid}-calculate-total-score-value-1`);
    expect(sumOfScores).toBeVisible();
    expect(sumOfScores.querySelector('input')).toBeChecked();
    expect(averageOfScores).toBeVisible();

    const lookupTable = screen.getByTestId(`${mockedTestid}-lookup-table`);
    expect(lookupTable).toBeVisible();

    fireEvent.click(lookupTable);
    expect(screen.getByTestId(`${mockedTestid}-lookup-table-popup`)).toBeVisible();
  });

  test('System Items are added/removed if LookupTable is uploaded/removed', async () => {
    const ref = renderSubscales();

    addSubscale();

    fireEvent.click(screen.getByTestId(`${mockedTestid}-0-lookup-table`));

    expect(screen.getByTestId(`${mockedTestid}-0-lookup-table-popup`)).toBeVisible();

    await waitFor(() => {
      screen.getByText('Your Lookup Table for was parsed successfully.');
    });

    fireEvent.click(screen.getByTestId(`${mockedTestid}-0-lookup-table-popup-submit-button`));

    await waitFor(() => {
      const addedSystemItems = ref.current
        .getValues('activities.0.items')
        .filter((item) => isSystemItem(item));
      expect(addedSystemItems).toHaveLength(2);
    });

    fireEvent.click(screen.getByTestId(`${mockedTestid}-0-remove`));

    await waitFor(() => {
      const addedSystemItems = ref.current
        .getValues('activities.0.items')
        .filter((item) => isSystemItem(item));
      expect(addedSystemItems).toHaveLength(0);
    });
  });

  test('Age field type setting is shown/hidden if LookupTable is uploaded/removed', async () => {
    await setUpLookupTable();

    expect(screen.queryByText('Age field type:')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId(`${mockedTestid}-0-remove`));

    expect(screen.queryByText('Age field type:')).not.toBeInTheDocument();
  });

  test('Age question respects field type setting', async () => {
    const ref = await setUpLookupTable();

    // Click "Text Field"
    fireEvent.click(screen.getByTestId(`${mockedTestid}-age-field-type-text`));

    await waitFor(() => {
      const ageSystemItem = (ref.current.getValues('activities.0.items') as ItemFormValues[]).find(
        (item) => item.name === LookupTableItems.Age_screen,
      );
      expect(ageSystemItem).not.toBeUndefined();
      expect(ageSystemItem?.responseType).toEqual('text');
    });

    // Click "Dropdown List"
    fireEvent.click(screen.getByTestId(`${mockedTestid}-age-field-type-dropdown`));

    await waitFor(() => {
      const ageSystemItem = (ref.current.getValues('activities.0.items') as ItemFormValues[]).find(
        (item) => item.name === LookupTableItems.Age_screen,
      );
      expect(ageSystemItem).not.toBeUndefined();
      expect(ageSystemItem?.responseType).toEqual('numberSelect');
    });
  });

  test('Upload Lookup Table does not remove non-system items with name "gender_screen"/"age_screen"', async () => {
    const ref = await setUpLookupTable(mockedAppletWithGenderAndAgeNonSystemItems);

    const items = ref.current.getValues('activities.0.items');

    expect(items).toHaveLength(4);
    expect(items.filter((item) => isSystemItem(item))).toHaveLength(2);
    expect(items.filter((item) => !isSystemItem(item))).toHaveLength(2);
  });

  test('Subscale is removed from the list of elements (cannot make recursive selection)', () => {
    renderSubscales();

    addSubscale();
    addSubscale();

    fireEvent.change(screen.getByTestId(`${mockedTestid}-0-name`).querySelector('input'), {
      target: { value: 'subscale_1' },
    });
    fireEvent.change(screen.getByTestId(`${mockedTestid}-1-name`).querySelector('input'), {
      target: { value: 'subscale_2' },
    });

    expect(
      screen.getAllByTestId(new RegExp(`${mockedTestid}-1-items-unselected-checkbox-\\d+$`)),
    ).toHaveLength(4);

    fireEvent.click(
      screen.getByTestId(`${mockedTestid}-0-items-unselected-checkbox-0`).querySelector('input'),
    );

    expect(
      screen.getAllByTestId(new RegExp(`${mockedTestid}-1-items-unselected-checkbox-\\d+$`)),
    ).toHaveLength(3);
  });

  test('Removing lookup table updates linked report score', async () => {
    const ref = createRef<ReturnType<typeof useForm>>();

    const formData: AppletFormValues = {
      ...mockedAppletWithAllItemTypes,
      activities: [
        {
          ...mockedAppletWithAllItemTypes.activities[0],
          items: [mockedSingleActivityItem],
          scoresAndReports: {
            generateReport: false,
            showScoreSummary: false,
            reports: [
              {
                type: ScoreReportType.Score,
                scoringType: 'score',
                subscaleName: 'Sum',
                name: 'From this test',
                id: 'sumScore_score1',
                calculationType: CalculationType.Sum,
                itemsScore: [mockedSingleActivityItem.id],
                message: 'score1',
                itemsPrint: [],
                key: '342a5c93-4c6c-443f-83e9-8b7d517c24ad',
                showMessage: true,
                printItems: false,
              },
            ],
          },
          subscaleSetting: {
            subscales: [
              {
                id: uuid(),
                name: 'Sum',
                scoring: SubscaleTotalScore.Sum,
                items: [getEntityKey(mockedSingleActivityItem)],
                subscaleTableData: [
                  {
                    score: '10',
                    rawScore: '1',
                    age: '15',
                    sex: 'M',
                    optionalText:
                      'https://gist.githubusercontent.com/benbalter/3914310/raw/f757a33411082da23f0ad4a124b45fcdacc1b43f/Example--text.txt',
                    id: '68171c94-9452-47ec-9df5-09ea47142461',
                  },
                ],
              },
            ],
          },
        },
      ],
    };

    const { getByTestId } = renderWithAppletFormData({
      appletFormData: formData,
      children: <SubscalesConfiguration />,
      formRef: ref,
      options: {
        routePath: page.builderAppletActivitySettingsItem,
        route: generatePath(page.builderAppletActivitySettingsItem, {
          appletId: formData.id,
          activityId: formData.activities[0].id,
          setting: SettingParam.SubscalesConfiguration,
        }),
      },
    });

    // Open lookup table popup
    await userEvent.click(getByTestId(`${mockedTestid}-0-lookup-table`));

    // Click the delete button
    await userEvent.click(getByTestId(`${mockedTestid}-0-lookup-table-popup-secondary-button`));

    // Confirm deletion
    await userEvent.click(getByTestId(`${mockedTestid}-0-lookup-table-popup-submit-button`));

    await waitFor(() => {
      const reportScore: ScoreReport = ref.current.getValues(
        'activities.0.scoresAndReports.reports.0',
      );
      expect(reportScore.scoringType).toEqual('raw_score');
      expect(reportScore.subscaleName).toEqual('');
    });
  });

  test('Deleting subscale updates linked report score', async () => {
    const ref = createRef<ReturnType<typeof useForm>>();

    const formData: AppletFormValues = {
      ...mockedAppletWithAllItemTypes,
      activities: [
        {
          ...mockedAppletWithAllItemTypes.activities[0],
          items: [mockedSingleActivityItem],
          scoresAndReports: {
            generateReport: false,
            showScoreSummary: false,
            reports: [
              {
                type: ScoreReportType.Score,
                scoringType: 'score',
                subscaleName: 'Sum',
                name: 'From this test',
                id: 'sumScore_score1',
                calculationType: CalculationType.Sum,
                itemsScore: [mockedSingleActivityItem.id],
                message: 'score1',
                itemsPrint: [],
                key: '342a5c93-4c6c-443f-83e9-8b7d517c24ad',
                showMessage: true,
                printItems: false,
              },
            ],
          },
          subscaleSetting: {
            subscales: [
              {
                id: uuid(),
                name: 'Sum',
                scoring: SubscaleTotalScore.Sum,
                items: [getEntityKey(mockedSingleActivityItem)],
                subscaleTableData: [
                  {
                    score: '10',
                    rawScore: '1',
                    age: '15',
                    sex: 'M',
                    optionalText:
                      'https://gist.githubusercontent.com/benbalter/3914310/raw/f757a33411082da23f0ad4a124b45fcdacc1b43f/Example--text.txt',
                    id: '68171c94-9452-47ec-9df5-09ea47142461',
                  },
                ],
              },
            ],
          },
        },
      ],
    };

    const { getByTestId } = renderWithAppletFormData({
      appletFormData: formData,
      children: <SubscalesConfiguration />,
      formRef: ref,
      options: {
        routePath: page.builderAppletActivitySettingsItem,
        route: generatePath(page.builderAppletActivitySettingsItem, {
          appletId: formData.id,
          activityId: formData.activities[0].id,
          setting: SettingParam.SubscalesConfiguration,
        }),
      },
    });

    // Click the remove subscale button
    await userEvent.click(getByTestId(`${mockedTestid}-0-remove`));

    await waitFor(() => {
      const reportScore: ScoreReport = ref.current.getValues(
        'activities.0.scoresAndReports.reports.0',
      );
      expect(reportScore.scoringType).toEqual('raw_score');
      expect(reportScore.subscaleName).toEqual('');
    });
  });

  test('Removing non-subscale items updates linked report score', async () => {
    const ref = createRef<ReturnType<typeof useForm>>();

    const formData: AppletFormValues = {
      ...mockedAppletWithAllItemTypes,
      activities: [
        {
          ...mockedAppletWithAllItemTypes.activities[0],
          items: [mockedSingleActivityItem],
          scoresAndReports: {
            generateReport: false,
            showScoreSummary: false,
            reports: [
              {
                type: ScoreReportType.Score,
                scoringType: 'score',
                subscaleName: 'Sum',
                name: 'From this test',
                id: 'sumScore_score1',
                calculationType: CalculationType.Sum,
                itemsScore: [mockedSingleActivityItem.id],
                message: 'score1',
                itemsPrint: [],
                key: '342a5c93-4c6c-443f-83e9-8b7d517c24ad',
                showMessage: true,
                printItems: false,
              },
            ],
          },
          subscaleSetting: {
            subscales: [
              {
                id: uuid(),
                name: 'Sum',
                scoring: SubscaleTotalScore.Sum,
                items: [getEntityKey(mockedSingleActivityItem)],
                subscaleTableData: [
                  {
                    score: '10',
                    rawScore: '1',
                    age: '15',
                    sex: 'M',
                    optionalText:
                      'https://gist.githubusercontent.com/benbalter/3914310/raw/f757a33411082da23f0ad4a124b45fcdacc1b43f/Example--text.txt',
                    id: '68171c94-9452-47ec-9df5-09ea47142461',
                  },
                ],
              },
            ],
          },
        },
      ],
    };

    const { getByTestId } = renderWithAppletFormData({
      appletFormData: formData,
      children: <SubscalesConfiguration />,
      formRef: ref,
      options: {
        routePath: page.builderAppletActivitySettingsItem,
        route: generatePath(page.builderAppletActivitySettingsItem, {
          appletId: formData.id,
          activityId: formData.activities[0].id,
          setting: SettingParam.SubscalesConfiguration,
        }),
      },
    });

    // Remove the item in the subscale (uncheck the checkbox)
    await userEvent.click(
      getByTestId(`${mockedTestid}-0-items-unselected-checkbox-0`).querySelector('input'),
    );

    await waitFor(() => {
      const reportScore: ScoreReport = ref.current.getValues(
        'activities.0.scoresAndReports.reports.0',
      );
      expect(reportScore.scoringType).toEqual('raw_score');
      expect(reportScore.subscaleName).toEqual('');
    });
  });

  test('Renaming a subscale updates linked report score', async () => {
    const ref = createRef<ReturnType<typeof useForm>>();

    const formData: AppletFormValues = {
      ...mockedAppletWithAllItemTypes,
      activities: [
        {
          ...mockedAppletWithAllItemTypes.activities[0],
          items: [mockedSingleActivityItem],
          scoresAndReports: {
            generateReport: false,
            showScoreSummary: false,
            reports: [
              {
                type: ScoreReportType.Score,
                scoringType: 'score',
                subscaleName: 'Sum',
                name: 'From this test',
                id: 'sumScore_score1',
                calculationType: CalculationType.Sum,
                itemsScore: [mockedSingleActivityItem.id],
                message: 'score1',
                itemsPrint: [],
                key: '342a5c93-4c6c-443f-83e9-8b7d517c24ad',
                showMessage: true,
                printItems: false,
              },
            ],
          },
          subscaleSetting: {
            subscales: [
              {
                id: uuid(),
                name: 'Sum',
                scoring: SubscaleTotalScore.Sum,
                items: [getEntityKey(mockedSingleActivityItem)],
                subscaleTableData: [
                  {
                    score: '10',
                    rawScore: '1',
                    age: '15',
                    sex: 'M',
                    optionalText:
                      'https://gist.githubusercontent.com/benbalter/3914310/raw/f757a33411082da23f0ad4a124b45fcdacc1b43f/Example--text.txt',
                    id: '68171c94-9452-47ec-9df5-09ea47142461',
                  },
                ],
              },
            ],
          },
        },
      ],
    };

    const { getByTestId } = renderWithAppletFormData({
      appletFormData: formData,
      children: <SubscalesConfiguration />,
      formRef: ref,
      options: {
        routePath: page.builderAppletActivitySettingsItem,
        route: generatePath(page.builderAppletActivitySettingsItem, {
          appletId: formData.id,
          activityId: formData.activities[0].id,
          setting: SettingParam.SubscalesConfiguration,
        }),
      },
    });

    // Add the text " Subscale" to the subscale name, which should now be "Sum Subscale"
    await userEvent.type(getByTestId(`${mockedTestid}-0-name`).querySelector('input'), ' Subscale');

    await waitFor(() => {
      const reportScore: ScoreReport = ref.current.getValues(
        'activities.0.scoresAndReports.reports.0',
      );
      expect(reportScore.subscaleName).toEqual('Sum Subscale');
    });
  });

  describe('Validations', () => {
    test.each`
      error                          | description
      ${'Subscale Name is required'} | ${'Subscale name is required'}
      ${'Select at least 1 element'} | ${'At least one element is required'}
    `('$description', async ({ error }) => {
      const ref = renderSubscales();

      addSubscale();

      await ref.current.trigger('activities.0.subscaleSetting');

      await waitFor(() => {
        expect(screen.getByText(error)).toBeVisible();
      });
    });

    test('Subscale Name should be unique', async () => {
      renderSubscales();

      addSubscale();
      addSubscale();

      fireEvent.change(screen.getByTestId(`${mockedTestid}-0-name`).querySelector('input'), {
        target: { value: 'subscale_1' },
      });
      fireEvent.change(screen.getByTestId(`${mockedTestid}-1-name`).querySelector('input'), {
        target: { value: 'subscale_1' },
      });

      await waitFor(() => {
        expect(
          screen.getByText('That Subscale Name is already in use. Please use a different name'),
        ).toBeVisible();
      });
    });

    describe('Parsing', () => {
      test('Lookup table is valid without severity column when enableCahmiSubscaleScoring is true', async () => {
        mockUseFeatureFlags.mockReturnValue({
          featureFlags: {
            enableCahmiSubscaleScoring: true,
          },
          resetLDContext: jest.fn(),
        });

        await setUpLookupTable();
      });

      test('Lookup table is valid without severity column when enableCahmiSubscaleScoring is false', async () => {
        renderSubscales();

        addSubscale();

        fireEvent.click(screen.getByTestId(`${mockedTestid}-0-lookup-table`));

        const popup = screen.getByTestId(`${mockedTestid}-0-lookup-table-popup`);

        expect(popup).toBeVisible();
        expect(popup).toHaveTextContent('Your Lookup Table for was parsed successfully.');
        expect(popup).not.toHaveTextContent('Severity');
      });

      test('Lookup table is valid with severity column when enableCahmiSubscaleScoring is true', async () => {
        mockUseFeatureFlags.mockReturnValue({
          featureFlags: { enableCahmiSubscaleScoring: true },
          resetLDContext: jest.fn(),
        });

        setMockLookupTableFileData([
          {
            score: '10',
            rawScore: '1',
            age: '15',
            sex: 'M',
            optionalText:
              'https://gist.githubusercontent.com/benbalter/3914310/raw/f757a33411082da23f0ad4a124b45fcdacc1b43f/Example--text.txt',
            severity: 'Minimal',
          },
        ]);

        renderSubscales();

        addSubscale();

        fireEvent.click(screen.getByTestId(`${mockedTestid}-0-lookup-table`));

        const popup = screen.getByTestId(`${mockedTestid}-0-lookup-table-popup`);

        expect(popup).toBeVisible();
        expect(popup).toHaveTextContent('Your Lookup Table for was parsed successfully.');
        expect(popup).toHaveTextContent('Severity');
        expect(popup).toHaveTextContent('Minimal');
      });

      test('Lookup table is valid with empty severity column', async () => {
        mockUseFeatureFlags.mockReturnValue({
          featureFlags: { enableCahmiSubscaleScoring: true },
          resetLDContext: jest.fn(),
        });

        setMockLookupTableFileData([
          {
            score: '10',
            rawScore: '1',
            age: '15',
            sex: 'M',
            optionalText:
              'https://gist.githubusercontent.com/benbalter/3914310/raw/f757a33411082da23f0ad4a124b45fcdacc1b43f/Example--text.txt',
            severity: '',
          },
        ]);

        await setUpLookupTable();
      });

      test('Lookup table is valid with incomplete severity column', async () => {
        mockUseFeatureFlags.mockReturnValue({
          featureFlags: { enableCahmiSubscaleScoring: true },
          resetLDContext: jest.fn(),
        });

        setMockLookupTableFileData([
          {
            score: '10',
            rawScore: '1',
            age: '15',
            sex: 'M',
            optionalText:
              'https://gist.githubusercontent.com/benbalter/3914310/raw/f757a33411082da23f0ad4a124b45fcdacc1b43f/Example--text.txt',
            severity: 'Minimal',
          },
          {
            score: '10',
            rawScore: '1',
            age: '15',
            sex: 'M',
            optionalText:
              'https://gist.githubusercontent.com/benbalter/3914310/raw/f757a33411082da23f0ad4a124b45fcdacc1b43f/Example--text.txt',
            severity: '',
          },
        ]);

        renderSubscales();

        addSubscale();

        fireEvent.click(screen.getByTestId(`${mockedTestid}-0-lookup-table`));

        const popup = screen.getByTestId(`${mockedTestid}-0-lookup-table-popup`);

        expect(popup).toBeVisible();
        expect(popup).toHaveTextContent('Your Lookup Table for was parsed successfully.');
        expect(popup).toHaveTextContent(
          'Current lookup table includes missing Severity in some rows',
        );
      });

      test('Lookup table fails with invalid severity value', async () => {
        mockUseFeatureFlags.mockReturnValue({
          featureFlags: { enableCahmiSubscaleScoring: true },
          resetLDContext: jest.fn(),
        });

        setMockLookupTableFileData([
          {
            score: '10',
            rawScore: '1',
            age: '15',
            sex: 'M',
            optionalText:
              'https://gist.githubusercontent.com/benbalter/3914310/raw/f757a33411082da23f0ad4a124b45fcdacc1b43f/Example--text.txt',
            severity: 'Invalid',
          },
        ]);

        renderSubscales();

        addSubscale();

        fireEvent.click(screen.getByTestId(`${mockedTestid}-0-lookup-table`));

        const popup = screen.getByTestId(`${mockedTestid}-0-lookup-table-popup`);

        expect(popup).toBeVisible();
        expect(popup).toHaveTextContent("Your file can't be parsed");
      });

      describe('Lookup Table supports valid ages', () => {
        test.each`
          age       | description                      | enableCahmiSubscaleScoring
          ${'1'}    | ${'Single non-negative integer'} | ${false}
          ${''}     | ${'No age'}                      | ${false}
          ${'1~20'} | ${'Proper age range'}            | ${true}
          ${'0'}    | ${'Zero'}                        | ${true}
        `('$description', async ({ age, enableCahmiSubscaleScoring }) => {
          mockUseFeatureFlags.mockReturnValue({
            featureFlags: { enableCahmiSubscaleScoring },
            resetLDContext: jest.fn(),
          });

          setMockLookupTableFileData([
            {
              score: '10',
              rawScore: '1',
              age,
              sex: 'M',
              optionalText:
                'https://gist.githubusercontent.com/benbalter/3914310/raw/f757a33411082da23f0ad4a124b45fcdacc1b43f/Example--text.txt',
            },
          ]);

          await setUpLookupTable();
        });
      });

      describe('Lookup Table does not support invalid ages', () => {
        test.each`
          age        | description                                                        | enableCahmiSubscaleScoring
          ${'1~20'}  | ${'Ranges not supported when enableCahmiSubscaleScoringis false '} | ${false}
          ${'-1'}    | ${'Age should not be negative'}                                    | ${false}
          ${'-1~20'} | ${'Age range should not be negative'}                              | ${true}
          ${'~20'}   | ${'Incomplete range left'}                                         | ${true}
          ${'1~'}    | ${'Incomplete range right'}                                        | ${true}
          ${'~'}     | ${'Incomplete range both sides'}                                   | ${true}
        `('$description', async ({ age, enableCahmiSubscaleScoring }) => {
          mockUseFeatureFlags.mockReturnValue({
            featureFlags: { enableCahmiSubscaleScoring },
            resetLDContext: jest.fn(),
          });

          setMockLookupTableFileData([
            {
              score: '10',
              rawScore: '1',
              age,
              sex: 'M',
              optionalText:
                'https://gist.githubusercontent.com/benbalter/3914310/raw/f757a33411082da23f0ad4a124b45fcdacc1b43f/Example--text.txt',
            },
          ]);

          renderSubscales();

          addSubscale();

          fireEvent.click(screen.getByTestId(`${mockedTestid}-0-lookup-table`));

          const popup = screen.getByTestId(`${mockedTestid}-0-lookup-table-popup`);

          expect(popup).toBeVisible();
          expect(popup).toHaveTextContent("Your file can't be parsed");
        });
      });
    });
  });
});
