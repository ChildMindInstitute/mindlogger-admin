// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen, within } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { SliderRows } from './SliderRows';

const props = {
  minDate: new Date('2024-03-27T23:00:13.757Z'),
  maxDate: new Date('2024-04-03T21:59:13.757Z'),
  color: '#0b6e99',
};
const mockActivityItem = {
  id: '5195c07b-3552-4d6d-8d00-e0e21aeab442',
  name: 'Item1',
  question: {
    en: 'Slider Rows. Mock',
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
};
const mockAnswers = {
  '06796e3a-3e9d-49e3-a8a7-c404b6626f80': [
    {
      answer: {
        value: 4,
        text: null,
      },
      date: '2024-04-02T14:05:57.993000',
    },
  ],
  'bb725892-f18a-4ec6-9461-a3d88d86af10': [
    {
      answer: {
        value: 1,
        text: null,
      },
      date: '2024-04-02T14:05:57.993000',
    },
  ],
};
const mockVersions = [
  {
    version: '1.1.0',
    createdAt: '2024-04-02T14:05:34.545902',
  },
];

describe('SliderRows component', () => {
  test('renders each row with correct props', () => {
    renderWithProviders(
      <SliderRows
        {...props}
        activityItem={mockActivityItem}
        answers={mockAnswers}
        versions={mockVersions}
        data-testid="test-slider-rows"
      />,
    );

    const rows = screen.getAllByTestId(/^test-slider-rows-row-\d+$/);
    expect(rows).toHaveLength(2);

    rows.forEach((row, index) => {
      const dataTestid = `test-slider-rows-slider-rows-${index}-multi-scatter-chart`;
      expect(
        within(row).getByText(mockActivityItem.responseValues.rows[index].label),
      ).toBeInTheDocument();
      expect(within(row).getByTestId(dataTestid)).toBeInTheDocument();
    });
  });
});
