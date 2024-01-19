// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef } from 'react';
import { screen, waitFor } from '@testing-library/react';

import { mockedSingleSelectFormValues } from 'shared/mock';
import { asyncTimeout, createArray, renderWithAppletFormData } from 'shared/utils';
import { CHANGE_DEBOUNCE_VALUE } from 'shared/consts';

import {
  mockedItemName,
  mockedDisplayedContentTestid,
  mockedEmptyItem,
  renderItemConfiguration,
  getAppletFormDataWithItem,
} from '../__mocks__';

describe('ItemConfiguration: Displayed Content', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each`
    item                            | description
    ${mockedEmptyItem}              | ${'is rendered for newly created item'}
    ${mockedSingleSelectFormValues} | ${'is rendered for existing item'}
  `('$description', ({ item }) => {
    renderWithAppletFormData({
      children: renderItemConfiguration(),
      appletFormData: getAppletFormDataWithItem(item),
    });

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
    const ref = createRef();

    renderWithAppletFormData({
      children: renderItemConfiguration(),
      formRef: ref,
    });

    ref.current.setValue(`${mockedItemName}.question`, text);

    await ref.current.trigger(`${mockedItemName}.question`);

    await waitFor(() => {
      expect(screen.getByText(expected)).toBeVisible();
    });
  });

  test('Displayed Content validation is not triggered for newly added item', async () => {
    renderWithAppletFormData({
      children: renderItemConfiguration(),
    });

    await asyncTimeout(CHANGE_DEBOUNCE_VALUE);

    expect(screen.queryByText('Displayed Content is required')).not.toBeInTheDocument();
  });
});
