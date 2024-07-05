// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef } from 'react';
import { generatePath } from 'react-router-dom';
import { screen, fireEvent, waitFor } from '@testing-library/react';

import { page } from 'resources';
import {
  mockIntersectionObserver,
  mockedAppletFormData,
  mockedSingleSelectFormValues,
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
import { createArray, getEntityKey } from 'shared/utils';
import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';
import { getNewActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';

import { ActivityItemsFlow } from './ActivityItemsFlow';

jest.mock('modules/Builder/hooks/useDataPreloader', () => ({
  useDataPreloader: ({ data }) => ({ data, isPending: false }),
}));

const mockedTestid = 'builder-activity-item-flow';

const mockedEmptyActivity = getNewActivity({});
const mockedAppletWithAllItemTypes = {
  ...mockedAppletFormData,
  activities: [
    {
      ...mockedEmptyActivity,
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
      ],
    },
  ],
};
const mockedOrderedConditionNameItems = [
  mockedSingleActivityItem,
  mockedMultiActivityItem,
  mockedDateActivityItem,
  mockedTimeActivityItem,
  mockedSliderActivityItem,
  mockedTimeRangeActivityItem,
  mockedSliderRowsActivityItem,
  mockedNumberSelectActivityItem,
  mockedMultiSelectRowsActivityItem,
  mockedSingleSelectRowsActivityItem,
];
const mockedOrderedSummaryItemItems = [
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
];

const renderActivityItemsFlow = (formData) => {
  const ref = createRef();

  renderWithAppletFormData({
    formRef: ref,
    appletFormData: formData,
    children: <ActivityItemsFlow />,
    options: {
      routePath: page.builderAppletActivityItemFlow,
      route: generatePath(page.builderAppletActivityItemFlow, {
        appletId: formData.id,
        activityId: getEntityKey(formData.activities[0]),
      }),
    },
  });

  return ref;
};

describe('Activity Items Flow', () => {
  beforeEach(() => {
    mockIntersectionObserver();
  });

  test.each`
    items | isAddDisabled | description
    ${0}  | ${true}       | ${'Empty state for activity without items'}
    ${1}  | ${true}       | ${'Empty state for activity with 1 item'}
    ${2}  | ${false}      | ${'Empty state for activity with more than 1 item'}
  `('$description', async ({ items, isAddDisabled }) => {
    renderActivityItemsFlow({
      ...mockedAppletFormData,
      activities: [
        {
          ...mockedEmptyActivity,
          items: createArray(items, () => mockedSingleSelectFormValues),
        },
      ],
    });

    expect(
      screen.getByText(
        'To determine the order of transition from one Item to another, an Item Flow can be created.',
      ),
    ).toBeVisible();

    const addItemFlow = screen.getByTestId(`${mockedTestid}-add`);
    expect(addItemFlow).toBeVisible();

    if (isAddDisabled) {
      const addItemFlow = screen.getByTestId(`${mockedTestid}-add`);

      expect(addItemFlow).toBeDisabled();

      fireEvent.mouseEnter(addItemFlow);

      await waitFor(() => {
        expect(screen.getByText('You need to create at least two Items first')).toBeVisible();
      });

      return;
    }

    expect(addItemFlow).not.toBeDisabled();
  });

  describe('Duplicate ItemFlow', () => {
    beforeEach(() => {
      renderActivityItemsFlow(mockedAppletWithAllItemTypes);
    });

    test('Duplicates ItemFlow successfully', async () => {
      fireEvent.click(screen.getByTestId(`${mockedTestid}-add`));

      expect(screen.getAllByTestId(new RegExp(`^${mockedTestid}-\\d+$`))).toHaveLength(1);

      fireEvent.click(screen.getByTestId(`builder-activity-item-flow-0-condition-0-name`));
      fireEvent.click(screen.getByTestId(`${mockedTestid}-0-duplicate`));

      expect(screen.getAllByTestId(new RegExp(`^${mockedTestid}-\\d+$`))).toHaveLength(2);
    });
  });

  test('Add/Remove Conditional works correctly', async () => {
    renderActivityItemsFlow(mockedAppletWithAllItemTypes);

    fireEvent.click(screen.getByTestId(`${mockedTestid}-add`));

    const oneFlow = screen.getAllByTestId(new RegExp(`^${mockedTestid}-\\d+$`));

    expect(oneFlow).toHaveLength(1);
    oneFlow.forEach((flow) => expect(flow).toBeVisible());

    fireEvent.click(screen.getByTestId(`${mockedTestid}-add`));

    const twoFlows = screen.getAllByTestId(new RegExp(`^${mockedTestid}-\\d+$`));

    expect(twoFlows).toHaveLength(2);
    twoFlows.forEach((flow) => expect(flow).toBeVisible());

    fireEvent.click(screen.getByTestId(`${mockedTestid}-1-remove`));

    expect(screen.getByTestId(`${mockedTestid}-remove-popup`)).toBeVisible();

    fireEvent.click(screen.getByTestId(`${mockedTestid}-remove-popup-submit-button`));

    expect(screen.getAllByTestId(new RegExp(`^${mockedTestid}-\\d+$`))).toHaveLength(1);

    fireEvent.click(screen.getByTestId(`${mockedTestid}-0-remove`));

    expect(screen.getByTestId(`${mockedTestid}-remove-popup`)).toBeVisible();

    fireEvent.click(screen.getByTestId(`${mockedTestid}-remove-popup-submit-button`));

    expect(screen.queryAllByTestId(new RegExp(`^${mockedTestid}-\\d+$`))).toHaveLength(0);
  });

  test('Add/Remove Condition works correctly', () => {
    renderActivityItemsFlow(mockedAppletWithAllItemTypes);

    fireEvent.click(screen.getByTestId(`${mockedTestid}-add`));
    fireEvent.click(screen.getByTestId(`${mockedTestid}-0-add`));

    expect(screen.getAllByTestId(new RegExp(`^${mockedTestid}-0-condition-\\d+$`))).toHaveLength(2);

    fireEvent.click(screen.getByTestId(`${mockedTestid}-0-condition-0-remove`));

    expect(screen.getAllByTestId(new RegExp(`^${mockedTestid}-0-condition-\\d+$`))).toHaveLength(1);
  });

  test('Conditional is rendered correctly by default', () => {
    renderActivityItemsFlow(mockedAppletWithAllItemTypes);

    fireEvent.click(screen.getByTestId(`${mockedTestid}-add`));

    expect(screen.getAllByTestId(new RegExp(`^${mockedTestid}-0-condition-\\d+$`))).toHaveLength(1);
    expect(screen.getAllByTestId(new RegExp(`^${mockedTestid}-0-summary$`))).toHaveLength(1);
    expect(screen.getByTestId(`${mockedTestid}-0-title`)).toHaveTextContent('Conditional 1');
    expect(screen.getByTestId(`${mockedTestid}-0-add`)).toBeVisible();
    expect(screen.getByTestId(`${mockedTestid}-0-duplicate`)).toBeVisible();
    expect(screen.getByTestId(`${mockedTestid}-0-remove`)).toBeVisible();
    expect(screen.getByTestId(`${mockedTestid}-0-condition-0-name`)).toBeVisible();

    const conditionType = screen.getByTestId(`${mockedTestid}-0-condition-0-type`);
    const conditionValue = screen.getByTestId(`${mockedTestid}-0-condition-0-selection-value`);
    expect(conditionType).toBeVisible();
    expect(conditionType.querySelector('input')).toBeDisabled();
    expect(conditionValue).toBeVisible();
    expect(conditionValue.querySelector('input')).toBeDisabled();

    expect(screen.getByTestId(`${mockedTestid}-0-summary-match`)).toBeVisible();
    expect(screen.getByTestId(`${mockedTestid}-0-summary-item`)).toBeVisible();
  });

  test('Condition Item: all items except Audio/Video/Photo/AudioPlayer/Drawing/Message are available', () => {
    renderActivityItemsFlow(mockedAppletWithAllItemTypes);

    fireEvent.click(screen.getByTestId(`${mockedTestid}-add`));

    fireEvent.mouseDown(
      screen.getByTestId(`${mockedTestid}-0-condition-0-name`).querySelector('[role="button"]'),
    );
    const nameDropdown = screen.getByTestId(`${mockedTestid}-0-condition-0-name-dropdown`);
    expect(nameDropdown).toBeVisible();

    const items = nameDropdown.querySelectorAll('li');
    expect(items).toHaveLength(10);

    items.forEach((item, index) => {
      expect(item).toHaveAttribute('data-value', mockedOrderedConditionNameItems[index].id);
      expect(item).toHaveTextContent(mockedOrderedConditionNameItems[index].name);
    });
  });

  test('Summary Item: all items are available', () => {
    renderActivityItemsFlow(mockedAppletWithAllItemTypes);

    fireEvent.click(screen.getByTestId(`${mockedTestid}-add`));

    fireEvent.mouseDown(
      screen.getByTestId(`${mockedTestid}-0-summary-item`).querySelector('[role="button"]'),
    );
    const itemDropdown = screen.getByTestId(`${mockedTestid}-0-summary-item-dropdown`);
    expect(itemDropdown).toBeVisible();

    const items = itemDropdown.querySelectorAll('li');
    expect(items).toHaveLength(17);

    items.forEach((item, index) => {
      expect(item).toHaveAttribute('data-value', mockedOrderedSummaryItemItems[index].id);
      expect(item).toHaveTextContent(mockedOrderedSummaryItemItems[index].name);
    });
  });

  describe('Validations', () => {
    test('Required fields', async () => {
      const ref = renderActivityItemsFlow(mockedAppletWithAllItemTypes);

      fireEvent.click(screen.getByTestId(`${mockedTestid}-add`));

      await ref.current.trigger('activities.0.conditionalLogic');

      await waitFor(() => {
        [
          `${mockedTestid}-0-condition-0-name`,
          `${mockedTestid}-0-condition-0-type`,
          `${mockedTestid}-0-condition-0-selection-value`,
          `${mockedTestid}-0-summary-match`,
          `${mockedTestid}-0-summary-item`,
        ].forEach((testId) => {
          expect(screen.getByTestId(testId).querySelector('div')).toHaveClass('Mui-error');
        });
      });
    });

    test('Contradiction', async () => {
      renderActivityItemsFlow(mockedAppletWithAllItemTypes);

      fireEvent.click(screen.getByTestId(`${mockedTestid}-add`));
      fireEvent.mouseDown(
        screen.getByTestId(`${mockedTestid}-0-condition-0-name`).querySelector('[role="button"]'),
      );
      fireEvent.click(
        screen
          .getByTestId(`${mockedTestid}-0-condition-0-name-dropdown`)
          .querySelector('li:nth-child(2)'),
      );
      fireEvent.mouseDown(
        screen.getByTestId(`${mockedTestid}-0-summary-item`).querySelector('[role="button"]'),
      );
      fireEvent.click(
        screen.getByTestId(`${mockedTestid}-0-summary-item-dropdown`).querySelector('li'),
      );

      await waitFor(() => {
        const error = screen.getByTestId(`${mockedTestid}-0-error`);

        expect(error).toBeVisible();
        expect(error).toHaveTextContent(
          'Selected position of the Item in the list contradicts the Item Flow',
        );
      });

      fireEvent.mouseDown(
        screen.getByTestId(`${mockedTestid}-0-summary-item`).querySelector('[role="button"]'),
      );
      fireEvent.click(
        screen
          .getByTestId(`${mockedTestid}-0-summary-item-dropdown`)
          .querySelector('li:last-child'),
      );

      await waitFor(() => {
        expect(screen.queryByTestId(`${mockedTestid}-0-error`)).not.toBeInTheDocument();
      });
    });
  });
});
