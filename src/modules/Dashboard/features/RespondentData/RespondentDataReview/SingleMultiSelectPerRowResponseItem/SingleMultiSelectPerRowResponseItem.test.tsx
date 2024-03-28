// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';
import { ItemResponseType } from 'shared/consts';

import { SingleMultiSelectPerRowResponseItem } from './SingleMultiSelectPerRowResponseItem';

const dataTestid = 'single-multi-select-per-row-response-item';
const activityItem = {
  responseType: ItemResponseType.SingleSelectionPerRow,
  responseValues: {
    rows: [
      { id: 'row-1', rowName: 'Row 1' },
      { id: 'row-2', rowName: 'Row 2' },
    ],
    options: [
      { id: 'option-1', text: 'Option 1', image: null, score: null, tooltip: null },
      { id: 'option-2', text: 'Option 2', image: null, score: null, tooltip: null },
    ],
  },
};
const answer = { value: ['', 'Option 1'] };

describe('SingleMultiSelectPerRowResponseItem', () => {
  test('renders component and children correctly', () => {
    renderWithProviders(
      <SingleMultiSelectPerRowResponseItem
        activityItem={activityItem}
        answer={answer}
        data-testid={dataTestid}
      />,
    );

    expect(screen.getByTestId(dataTestid)).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestid}-options`)).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestid}-item-rows`)).toBeInTheDocument();
  });
});
