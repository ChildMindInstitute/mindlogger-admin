// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef } from 'react';
import { generatePath } from 'react-router-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { page } from 'resources';
import { mockedActivityId, mockedAppletId, mockedSingleSelectFormValues } from 'shared/mock';
import { asyncTimeout, createArray } from 'shared/utils';
import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';
import { CHANGE_DEBOUNCE_VALUE } from 'shared/consts';

import {
  mockedItemName,
  mockedDisplayedContentTestid,
  mockedEmptyItem,
  renderItemConfiguration,
  getAppletFormDataWithItem,
} from '../__mocks__';

const mockedItemId = mockedSingleSelectFormValues.id;

const renderItemConfig = (item) => {
  const ref = createRef();

  renderWithAppletFormData({
    children: renderItemConfiguration(),
    appletFormData: item ? getAppletFormDataWithItem(item) : undefined,
    formRef: ref,
    options: {
      routePath: page.builderAppletActivityItem,
      route: generatePath(page.builderAppletActivityItem, {
        appletId: mockedAppletId,
        activityId: mockedActivityId,
        itemId: mockedItemId,
      }),
    },
  });

  return ref;
};

describe('ItemConfiguration: Displayed Content', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each`
    item                            | description
    ${mockedEmptyItem}              | ${'is rendered for newly created item'}
    ${mockedSingleSelectFormValues} | ${'is rendered for existing item'}
  `('$description', ({ item }) => {
    renderItemConfig(item);

    const displayedContent = screen.getByTestId(mockedDisplayedContentTestid);

    expect(displayedContent).toBeVisible();
  });

  test.each`
    text                                    | expected                                                        | description
    ${''}                                   | ${'Displayed Content is required'}                              | ${'cannot be empty'}
    ${createArray(175, () => 'i').join('')} | ${'Visibility decreases over 75 characters'}                    | ${'shows warning for text more than 75 chars'}
    ${'[[Item1]]'}                          | ${'* You cannot use item name in the same item. Please remove'} | ${'cannot have item variable with the same name as current item'}
    ${'[[sliderrows]]'}                     | ${'* This item is not supported, please remove it.'}            | ${'item type of selected variable is not supported'}
    ${'[[Item5]]'}                          | ${'Remove the variable referring to the skipped item.'}         | ${'cannot have item variable which is skippable'}
    ${'[[ItemItem]]'}                       | ${'Remove the variable referring to the nonexistent item.'}     | ${'cannot refer to non-existent item'}
  `('$description', async ({ text, expected }) => {
    const ref = renderItemConfig();

    fireEvent.change(
      screen
        .getByTestId('builder-activity-items-item-configuration-description')
        .querySelector('textarea'),
      { target: { value: text } },
    );

    await ref.current.trigger(`${mockedItemName}.question`);

    await waitFor(() => {
      expect(screen.getByText(expected)).toBeVisible();
    });
  });

  test('Displayed Content validation is not triggered for newly added item', async () => {
    renderItemConfig();

    await asyncTimeout(CHANGE_DEBOUNCE_VALUE);

    expect(screen.queryByText('Displayed Content is required')).not.toBeInTheDocument();
  });
});
