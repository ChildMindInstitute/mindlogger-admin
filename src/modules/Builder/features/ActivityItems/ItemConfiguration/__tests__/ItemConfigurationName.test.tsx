// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef } from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';

import { mockedSingleSelectFormValues, mockedAppletFormData } from 'shared/mock';
import { asyncTimeout, renderWithAppletFormData } from 'shared/utils';
import { CHANGE_DEBOUNCE_VALUE } from 'shared/consts';

import {
  renderItemConfiguration,
  mockedNameTestid,
  getAppletFormDataWithItem,
  mockedItemName,
} from '../__mocks__';

describe('ItemConfiguration: Item Name', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each`
    item                            | expected   | description
    ${undefined}                    | ${'Item'}  | ${'is rendered with empty string for newly added item'}
    ${mockedSingleSelectFormValues} | ${'Item1'} | ${'is rendered with correct value for existing item'}
  `('$description', ({ item, expected }) => {
    renderWithAppletFormData({
      children: renderItemConfiguration(),
      appletFormData: getAppletFormDataWithItem(item),
    });

    const name = screen.getByTestId(mockedNameTestid);

    expect(name).toBeVisible();
    expect(name.querySelector('input')).toHaveValue(expected);
  });

  test.each`
    text         | expected                                                                         | description
    ${''}        | ${'Item Name is required'}                                                       | ${'empty name is not allowed'}
    ${'Item1!'}  | ${'Item Name must contain only alphanumeric characters, underscores, or hyphen'} | ${'other symbols than a-zA-Z0-9_- are not allowed'}
    ${'Item2'}   | ${'That Item Name is already in use. Please use a different name'}               | ${'name should be unique among the others in activity'}
    ${'Item1_-'} | ${''}                                                                            | ${'name with a-zA-Z0-9_- is allowed'}
  `('$description', async ({ text, expected }) => {
    const ref = createRef();

    renderWithAppletFormData({
      children: renderItemConfiguration(),
      appletFormData: mockedAppletFormData,
      formRef: ref,
    });

    const name = screen.getByTestId(mockedNameTestid);
    const input = name.querySelector('input');
    const error = name.querySelector('.Mui-error');

    fireEvent.change(input, { target: { value: text } });

    await asyncTimeout(CHANGE_DEBOUNCE_VALUE);

    await ref.current.trigger(`${mockedItemName}.name`);

    await waitFor(() => {
      expected
        ? expect(screen.getByText(expected)).toBeVisible()
        : expect(error).not.toBeInTheDocument();
    });
  });
});
