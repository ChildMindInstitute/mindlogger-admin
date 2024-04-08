// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen, within } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

import { SliderRowsResponseItem } from './SliderRowsResponseItem';

const mockActivityItem = {
  question: {
    en: 'Slider Rows. Test',
  },
  responseType: 'sliderRows',
  responseValues: {
    rows: [
      {
        minValue: 1,
        maxValue: 5,
        id: '06796e3a-3e9d-49e3-a8a7-c404b6626f80',
        label: 'Slider 1',
      },
      {
        minValue: 0,
        maxValue: 2,
        id: 'bb725892-f18a-4ec6-9461-a3d88d86af10',
        label: 'Slider 2',
      },
    ],
  },
  config: {
    removeBackButton: false,
    skippableItem: false,
    addScores: false,
    setAlerts: false,
    timer: 0,
  },
  name: 'Item1',
  id: '5195c07b-3552-4d6d-8d00-e0e21aeab442',
  order: 1,
};
const mockAnswer = {
  value: [4, 1],
};

describe('SliderRowsResponseItem component', () => {
  test('renders each row with correct answer', () => {
    renderWithProviders(
      <SliderRowsResponseItem
        activityItem={mockActivityItem}
        answer={mockAnswer}
        data-testid="test-slider-rows-response-item"
      />,
    );

    const rows = screen.getAllByTestId(/^test-slider-rows-response-item-row-\d+$/);
    expect(rows).toHaveLength(2);

    rows.forEach((row, index) => {
      const dataTestid = `test-slider-rows-response-item-row-${index}-slider`;
      const { label, minValue, maxValue } = mockActivityItem.responseValues.rows[index];
      expect(within(row).getByText(label)).toBeInTheDocument();
      expect(within(row).getByTestId(dataTestid)).toBeInTheDocument();

      const input = row.querySelector('input');
      expect(input).toBeInTheDocument();
      const minAttribute = input.getAttribute('min');
      const maxAttribute = input.getAttribute('max');
      const valueAttribute = input.getAttribute('value');

      expect(minAttribute).toBe(`${minValue}`);
      expect(maxAttribute).toBe(`${maxValue}`);
      expect(valueAttribute).toBe(`${mockAnswer.value[index]}`);
    });
  });
});
