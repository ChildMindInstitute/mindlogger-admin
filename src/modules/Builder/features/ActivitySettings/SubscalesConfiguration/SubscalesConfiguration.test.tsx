// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef } from 'react';

import { screen, fireEvent, waitFor } from '@testing-library/react';
import { generatePath } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { page } from 'resources';
import {
  mockedAppletFormData,
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
} from 'shared/mock';
import { SettingParam, isSystemItem, renderWithAppletFormData } from 'shared/utils';

import { SubscalesConfiguration } from './SubscalesConfiguration';

const mockedTestid = 'builder-activity-settings-subscales';

const mockedSingleActivityItemWithoutScores = {
  ...mockedSingleActivityItem,
  id: uuidv4(),
  name: `${mockedSingleActivityItem.name}_no_scores`,
  responseValues: {
    ...mockedSingleActivityItem.responseValues,
    options: mockedSingleActivityItem.responseValues.options.map(option => ({
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
    options: mockedMultiActivityItem.responseValues.options.map(option => ({
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
const mockedAvailableItems = [mockedSingleActivityItem, mockedMultiActivityItem, mockedSliderActivityItem];

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
  const ref = createRef();

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

jest.mock('shared/components/FileUploader/FileUploader', () => ({
  ...jest.requireActual('__mocks__/LookupTableUploader'),
}));

describe('SubscalesConfiguration', () => {
  beforeEach(() => {});
  test('Default Empty Page', () => {
    renderSubscales();

    expect(screen.getByTestId(`${mockedTestid}-add`)).toBeVisible();
    expect(screen.queryAllByTestId(new RegExp(`^${mockedTestid}-\\d+$`))).toHaveLength(0);
    expect(screen.queryByTestId(`${mockedTestid}-elements-associated-with-subscales`)).not.toBeInTheDocument();
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
    ].forEach(testId => {
      expect(screen.getByTestId(testId)).toBeVisible();
    });
  });

  test('Items available for selecting in Subscale', () => {
    renderSubscales();

    addSubscale();

    const itemsToSelect = screen.getByTestId(`${mockedTestid}-0-items-unselected`).querySelectorAll('tbody tr');
    expect(itemsToSelect).toHaveLength(3);

    itemsToSelect.forEach((item, index) => {
      const selectedItem = mockedAvailableItems[index];
      expect(item).toHaveTextContent(`Item: ${selectedItem.name}: ${selectedItem.question}`);
    });

    addSubscale();
    const newItemsToSelect = screen.getByTestId(`${mockedTestid}-0-items-unselected`).querySelectorAll('tbody tr');
    expect(newItemsToSelect).toHaveLength(4);
    expect(newItemsToSelect[0]).toHaveTextContent('Subscale: ()');

    fireEvent.change(screen.getByTestId(`${mockedTestid}-1-name`).querySelector('input'), {
      target: { value: 'subscale_2' },
    });
    expect(newItemsToSelect[0]).toHaveTextContent('Subscale: subscale_2 ()');
  });

  test('Elements Associated works correctly', () => {
    renderSubscales();

    addSubscale();
    addSubscale();

    fireEvent.change(screen.getByTestId(`${mockedTestid}-0-name`).querySelector('input'), {
      target: { value: 'subscale_1' },
    });
    fireEvent.change(screen.getByTestId(`${mockedTestid}-1-name`).querySelector('input'), {
      target: { value: 'subscale_2' },
    });
    fireEvent.click(screen.getByTestId(`${mockedTestid}-0-items-unselected-checkbox-0`).querySelector('input'));
    fireEvent.click(screen.getByTestId(`${mockedTestid}-1-items-unselected-checkbox-0`).querySelector('input'));

    const elementsAssociated = screen
      .getByTestId(`${mockedTestid}-elements-associated-with-subscales`)
      .querySelectorAll('tbody tr');

    expect(elementsAssociated).toHaveLength(2);

    const [associatedSubscale, associatedItem] = elementsAssociated;
    const [associatedSubscaleElement, associatedSubscaleSubscale] = associatedSubscale.querySelectorAll('td');
    const [associatedItemElement, associatedItemSubscale] = associatedItem.querySelectorAll('td');

    expect(associatedSubscaleElement).toHaveTextContent('Subscale: subscale_2 (Item: single_text_score)');
    expect(associatedSubscaleSubscale).toHaveTextContent('subscale_1');

    expect(associatedItemElement).toHaveTextContent('Item: single_text_score');
    expect(associatedItemSubscale).toHaveTextContent('subscale_2');
  });

  test('Calculate Total Score works correctly', () => {
    renderSubscales();

    addSubscale();

    const calculateTotalScoreSwitch = screen.getByTestId(`${mockedTestid}-calculate-total-score`);
    expect(calculateTotalScoreSwitch.querySelector('.MuiSwitch-switchBase')).not.toHaveClass('Mui-checked');
    fireEvent.click(calculateTotalScoreSwitch.querySelector('input'));
    expect(calculateTotalScoreSwitch.querySelector('.MuiSwitch-switchBase')).toHaveClass('Mui-checked');

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
      const addedSystemItems = ref.current.getValues('activities.0.items').filter(item => isSystemItem(item));
      expect(addedSystemItems).toHaveLength(2);
    });

    fireEvent.click(screen.getByTestId(`${mockedTestid}-0-remove`));

    await waitFor(() => {
      const addedSystemItems = ref.current.getValues('activities.0.items').filter(item => isSystemItem(item));
      expect(addedSystemItems).toHaveLength(0);
    });
  });

  test('Upload Lookup Table does not remove non-system items with name "gender_screen"/"age_screen"', async () => {
    const ref = renderSubscales(mockedAppletWithGenderAndAgeNonSystemItems);

    addSubscale();

    fireEvent.click(screen.getByTestId(`${mockedTestid}-0-lookup-table`));

    expect(screen.getByTestId(`${mockedTestid}-0-lookup-table-popup`)).toBeVisible();

    await waitFor(() => {
      screen.getByText('Your Lookup Table for was parsed successfully.');
    });

    fireEvent.click(screen.getByTestId(`${mockedTestid}-0-lookup-table-popup-submit-button`));

    const items = ref.current.getValues('activities.0.items');

    expect(items).toHaveLength(4);
    expect(items.filter(item => isSystemItem(item))).toHaveLength(2);
    expect(items.filter(item => !isSystemItem(item))).toHaveLength(2);
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

    expect(screen.getAllByTestId(new RegExp(`${mockedTestid}-1-items-unselected-checkbox-\\d+$`))).toHaveLength(4);

    fireEvent.click(screen.getByTestId(`${mockedTestid}-0-items-unselected-checkbox-0`).querySelector('input'));

    expect(screen.getAllByTestId(new RegExp(`${mockedTestid}-1-items-unselected-checkbox-\\d+$`))).toHaveLength(3);
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
      const ref = renderSubscales();

      addSubscale();
      addSubscale();

      fireEvent.change(screen.getByTestId(`${mockedTestid}-0-name`).querySelector('input'), {
        target: { value: 'subscale_1' },
      });
      fireEvent.change(screen.getByTestId(`${mockedTestid}-1-name`).querySelector('input'), {
        target: { value: 'subscale_1' },
      });

      await waitFor(() => {
        expect(screen.getByText('That Subscale Name is already in use. Please use a different name')).toBeVisible();
      });
    });
  });
});
