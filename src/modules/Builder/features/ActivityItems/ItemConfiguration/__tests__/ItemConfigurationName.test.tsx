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

const mockedAppletFormDataWithSystemItems = {
  ...mockedAppletFormData,
  activities: [
    {
      ...mockedAppletFormData.activities[0],
      items: [
        ...mockedAppletFormData.activities[0].items,
        { name: 'age_screen', allowEdit: false },
        { name: 'gender_screen', allowEdit: false },
      ],
    },
  ],
};

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
    text               | expected                                                                                                                                                                                  | description
    ${''}              | ${'Item Name is required'}                                                                                                                                                                | ${'empty name is not allowed'}
    ${'Item1!'}        | ${'Item Name must contain only alphanumeric characters, underscores, or hyphen'}                                                                                                          | ${'other symbols than a-zA-Z0-9_- are not allowed'}
    ${'Item2'}         | ${'That Item Name is already in use. Please use a different name'}                                                                                                                        | ${'name should be unique among the others in activity'}
    ${'age_screen'}    | ${'The activity already contains a system item age_screen which was added automatically after the Subscales Lookup Table was uploaded. Please create a different name for this item.'}    | ${'age_screen is not allowed if there are system items'}
    ${'gender_screen'} | ${'The activity already contains a system item gender_screen which was added automatically after the Subscales Lookup Table was uploaded. Please create a different name for this item.'} | ${'gender_screen is not allowed if there are system items'}
    ${'Item1_-'}       | ${''}                                                                                                                                                                                     | ${'name with a-zA-Z0-9_- is allowed'}
  `('$description', async ({ text, expected }) => {
    const ref = createRef();

    renderWithAppletFormData({
      children: renderItemConfiguration(),
      appletFormData: mockedAppletFormDataWithSystemItems,
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
