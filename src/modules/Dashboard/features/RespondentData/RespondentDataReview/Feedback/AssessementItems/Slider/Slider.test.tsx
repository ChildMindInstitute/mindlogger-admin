// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils';

import { Slider } from './Slider';

const activityItem = {
  question: {
    en: 'Slider',
  },
  responseType: 'slider',
  responseValues: {
    minLabel: 'Min',
    maxLabel: 'Max',
    minValue: 0,
    maxValue: 5,
    minImage: 'https://example.com/images/minImg.jpeg',
    maxImage: 'https://example.com/images/maxImg.jpeg',
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
  id: 'a99ffccb-c6d2-44bf-b924-ea8e1a78ba50',
  order: 2,
};

const dataTestid = 'slider';
const onChange = jest.fn();

describe('Slider', () => {
  test('renders the slider component with images and labels', async () => {
    renderWithProviders(<Slider onChange={onChange} data-testid={dataTestid} activityItem={activityItem} />);

    const slider = screen.getByTestId(dataTestid);
    expect(slider).toBeInTheDocument();

    const sliderMarks = slider.getElementsByClassName('MuiSlider-mark');
    expect(sliderMarks).toHaveLength(6);

    const minImg = screen.getByTestId(`${dataTestid}-min-image`);
    const maxImg = screen.getByTestId(`${dataTestid}-max-image`);
    expect(minImg).toBeInTheDocument();
    expect(maxImg).toBeInTheDocument();
    expect(minImg).toHaveAttribute('src', 'https://example.com/images/minImg.jpeg');
    expect(maxImg).toHaveAttribute('src', 'https://example.com/images/maxImg.jpeg');

    const minLabel = screen.getByTestId(`${dataTestid}-min-label`);
    const maxLabel = screen.getByTestId(`${dataTestid}-max-label`);
    expect(minLabel).toBeInTheDocument();
    expect(maxLabel).toBeInTheDocument();
    expect(minLabel).toHaveTextContent('Min');
    expect(maxLabel).toHaveTextContent('Max');

    await userEvent.click(sliderMarks[2]);

    expect(onChange).toHaveBeenCalled();
  });
});
