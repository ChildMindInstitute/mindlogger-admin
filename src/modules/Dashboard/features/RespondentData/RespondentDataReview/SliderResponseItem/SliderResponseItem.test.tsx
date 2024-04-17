// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { SliderResponseItem } from './SliderResponseItem';

const activityItem = {
  question: {
    en: 'How did you sleep last night?',
  },
  responseType: 'slider',
  responseValues: {
    minLabel: 'Bad',
    maxLabel: 'Good',
    minValue: 0,
    maxValue: 5,
  },
  config: {
    removeBackButton: false,
    skippableItem: false,
    addScores: false,
    setAlerts: false,
    additionalResponseOption: {
      textInputOption: false,
      textInputRequired: false,
    },
    showTickMarks: true,
    showTickLabels: true,
    continuousSlider: false,
    timer: 0,
  },
  name: 'Item2',
  isHidden: false,
  allowEdit: true,
  id: '2842e927-81ab-4e56-97d4-7f73edd6a277',
  order: 2,
};

const answer1 = {
  value: 2,
  text: null,
};

const answer2 = {
  value: null,
  text: null,
};

const answer3 = {
  value: '3',
  text: null,
};

const answer4 = {
  value: [2, 4],
  text: null,
};

const dataTestid = 'respondents-review-activity-items-response';

describe('SliderResponseItem', () => {
  test('renders slider item with options correctly', async () => {
    renderWithProviders(
      <SliderResponseItem activityItem={activityItem} answer={answer1} data-testid={dataTestid} />,
    );

    const item = screen.getByTestId(dataTestid);
    expect(item).toBeInTheDocument();

    const sliderMarkLabels = item.getElementsByClassName('MuiSlider-markLabel');
    expect(sliderMarkLabels.length).toBe(6); // from 0 to 5

    for (let i = 0; i < sliderMarkLabels.length; i++) {
      const markLabel = sliderMarkLabels[i];
      expect(markLabel).toHaveTextContent(i.toString());
    }

    const sliderThumbs = item.getElementsByClassName('MuiSlider-thumb');
    expect(sliderThumbs.length).toBe(1);

    const sliderThumb = sliderThumbs[0];
    const input = sliderThumb.querySelector('input');

    expect(input).toBeInTheDocument();

    const minAttribute = input.getAttribute('min');
    const maxAttribute = input.getAttribute('max');

    expect(minAttribute).toBe('0');
    expect(maxAttribute).toBe('5');
  });

  test.each`
    answer     | expectedValue | description
    ${answer1} | ${'2'}        | ${'slider value shound be 2, when answer is 2 (number)'}
    ${answer2} | ${'0'}        | ${'slider value shound be 0, when answer is null'}
    ${answer3} | ${'3'}        | ${'slider value shound be 3, when answer is 3 (string)'}
    ${answer4} | ${'0'}        | ${'slider value shound be 0, when answer is the array'}
  `('$description', ({ answer, expectedValue }) => {
    renderWithProviders(
      <SliderResponseItem activityItem={activityItem} answer={answer} data-testid={dataTestid} />,
    );

    const item = screen.getByTestId(dataTestid);

    const sliderThumbs = item.getElementsByClassName('MuiSlider-thumb');
    expect(sliderThumbs.length).toBe(1);

    const sliderThumb = sliderThumbs[0];
    const input = sliderThumb.querySelector('input');

    expect(input).toBeInTheDocument();

    const valueAttribute = input.getAttribute('value');

    expect(valueAttribute).toBe(expectedValue);
  });
});
