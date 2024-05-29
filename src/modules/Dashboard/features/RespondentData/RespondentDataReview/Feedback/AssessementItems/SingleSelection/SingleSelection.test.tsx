// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { SingleSelection } from './SingleSelection';

const activityItem = {
  question: {
    en: 'SingleSelect',
  },
  responseType: 'singleSelect',
  responseValues: {
    options: [
      {
        id: 'ef724379-2f5b-40d5-97e7-eb945e559d78',
        text: 'Option 1',
        image: 'https://example.com/images/image1.jpeg',
        tooltip: 'Tooltip 1',
        value: 0,
      },
      {
        id: '23649d61-d021-4b56-a976-f8820beb7a0b',
        text: 'Option 2',
        image: 'https://example.com/images/image2.jpeg',
        tooltip: 'Tooltip 2',
        value: 1,
      },
      {
        id: 'a89d2f1d-357e-4724-a0f2-203582c299b0',
        text: 'Option 3',
        image: null,
        tooltip: null,
        value: 2,
      },
    ],
  },
  name: 'Item1',
  id: '447e050e-7576-4e64-a39a-82e874477745',
  order: 1,
};

const dataTestid = 'single-select';
const onChange = jest.fn();

describe('SingleSelection', () => {
  test('renders the single selection component with images and labels', async () => {
    renderWithProviders(
      <SingleSelection onChange={onChange} data-testid={dataTestid} activityItem={activityItem} />,
    );

    const singleSelect = screen.getByTestId(dataTestid);
    expect(singleSelect).toBeInTheDocument();

    const options = screen.getAllByTestId(/^single-select-option-\d+$/);
    expect(options).toHaveLength(3);

    const images = screen.getAllByTestId(/^single-select-image-\d+$/);
    expect(images).toHaveLength(2);

    const moreInfo = screen.getAllByTestId(/^single-select-more-info-\d+$/);
    expect(moreInfo).toHaveLength(2);

    // check tooltip
    const tooltips = screen.queryAllByTestId(/^single-select-tooltip-\d+$/);
    expect(tooltips).toHaveLength(0);

    userEvent.hover(screen.getByTestId('single-select-more-info-0'));

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent('Tooltip 1');

    userEvent.unhover(screen.getByTestId('single-select-more-info-0'));

    await waitFor(() => {
      const tooltip = screen.queryByRole('tooltip');
      expect(tooltip).not.toBeInTheDocument();
    });

    // check click
    const radio = options[1].querySelector('input');
    await userEvent.click(radio);

    expect(onChange).toHaveBeenCalled();
  });
});
