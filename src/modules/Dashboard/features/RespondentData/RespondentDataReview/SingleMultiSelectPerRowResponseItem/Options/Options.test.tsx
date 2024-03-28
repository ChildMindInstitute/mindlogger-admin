import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

import { Options } from './Options';

const dataTestid = 'options';
const optionsProps = [
  { id: 'option-1', text: 'Option 1', image: null, score: null, tooltip: null },
  { id: 'option-2', text: 'Option 2', image: null, score: null, tooltip: null },
];

describe('Options', () => {
  test('renders component correctly', () => {
    renderWithProviders(<Options options={optionsProps} data-testid={dataTestid} />);

    const options = screen.getAllByTestId(new RegExp(`^${dataTestid}-option-\\d+$`));
    expect(options).toHaveLength(3);

    options.forEach((option, index) => {
      if (index > 0) {
        expect(option).toHaveTextContent(optionsProps[index - 1].text);

        return;
      }
      expect(option).toHaveTextContent('');
    });
  });
});
