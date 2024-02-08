// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { fireEvent, screen } from '@testing-library/react';

import { ItemResponseType } from 'shared/consts';

import { mockedTestid, renderItemConfigurationByType } from '../__mocks__';

const mockedNumberTestid = `${mockedTestid}-number-selection`;

const renderNumberSelection = () => renderItemConfigurationByType(ItemResponseType.NumberSelection);

describe('Item Configuration: Number Selection', () => {
  test('Is rendered correctly', () => {
    renderNumberSelection();

    expect(screen.getByTestId(mockedNumberTestid)).toBeVisible();

    const title = screen.getByTestId(`${mockedNumberTestid}-title`);
    const minValue = screen.getByTestId(`${mockedNumberTestid}-min-value`).querySelector('input');
    const maxValue = screen.getByTestId(`${mockedNumberTestid}-max-value`).querySelector('input');

    expect(title).toBeVisible();
    expect(title).toHaveTextContent('Number Selection');

    expect(minValue).toBeVisible();
    expect(minValue).toHaveValue(0);

    expect(maxValue).toBeVisible();
    expect(maxValue).toHaveValue(1);
  });

  test.each`
    isMin    | value  | error                                        | description
    ${true}  | ${-15} | ${'A positive integer or 0 is required'}     | ${'Validation: Only positive integers'}
    ${true}  | ${2}   | ${'Min Value should be less than Max Value'} | ${'Validation: min value < max value'}
    ${false} | ${'a'} | ${'A positive integer is required'}          | ${'Validation: integer value'}
  `('$description', async ({ isMin, value, error }) => {
    renderNumberSelection();

    const testId = isMin ? `${mockedNumberTestid}-min-value` : `${mockedNumberTestid}-max-value`;

    fireEvent.change(screen.getByTestId(testId).querySelector('input'), {
      target: { value },
    });

    expect(await screen.findByText(error)).toBeVisible();
  });
});
