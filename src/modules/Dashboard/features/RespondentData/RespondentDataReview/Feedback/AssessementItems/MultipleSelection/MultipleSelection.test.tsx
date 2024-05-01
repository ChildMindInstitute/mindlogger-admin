// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { JEST_TEST_TIMEOUT } from 'shared/consts';

import { MultipleSelection } from './MultipleSelection';

const activityItem = {
  question: {
    en: 'MultiSelect',
  },
  responseType: 'multiSelect',
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

const dataTestid = 'multi-select';
const onChange = jest.fn();

describe('MultipleSelection', () => {
  test(
    'renders the multiple selection component with images and labels',
    async () => {
      renderWithProviders(
        <MultipleSelection
          onChange={onChange}
          data-testid={dataTestid}
          activityItem={activityItem}
          value={[]}
        />,
      );

      const multiSelect = screen.getByTestId(dataTestid);
      expect(multiSelect).toBeInTheDocument();

      const options = screen.getAllByTestId(/^multi-select-option-\d+$/);
      expect(options).toHaveLength(3);

      const images = screen.getAllByTestId(/^multi-select-image-\d+$/);
      expect(images).toHaveLength(2);

      const moreInfo = screen.getAllByTestId(/^multi-select-more-info-\d+$/);
      expect(moreInfo).toHaveLength(2);

      // check tooltip
      const tooltips = screen.queryAllByTestId(/^multi-select-tooltip-\d+$/);
      expect(tooltips).toHaveLength(0);

      userEvent.hover(screen.getByTestId('multi-select-more-info-0'));

      const tooltip = await screen.findByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent('Tooltip 1');

      userEvent.unhover(screen.getByTestId('multi-select-more-info-0'));

      await waitFor(() => {
        const tooltip = screen.queryByRole('tooltip');
        expect(tooltip).not.toBeInTheDocument();
      });

      // check click
      await userEvent.click(options[1]);
      expect(onChange).toHaveBeenCalled();
    },
    JEST_TEST_TIMEOUT,
  );
});
