import { screen, within } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

import { ItemRows } from './ItemRows';

const dataTestid = 'item-rows';
const responseValues = {
  rows: [
    { id: 'row-1', rowName: 'Row 1' },
    { id: 'row-2', rowName: 'Row 2' },
  ],
  options: [
    { id: 'option-1', text: 'Option 1', image: null, score: null, tooltip: null },
    { id: 'option-2', text: 'Option 2', image: null, score: null, tooltip: null },
  ],
};
describe('ItemRows', () => {
  test('renders component for isMultuple = true', () => {
    const answer = { value: ['', 'Option 1'] };
    renderWithProviders(
      <ItemRows responseValues={responseValues} answer={answer} data-testid={dataTestid} />,
    );

    const rows = screen.getAllByTestId(new RegExp(`^${dataTestid}-row-\\d+$`));
    expect(rows).toHaveLength(2);

    rows.forEach((row, rowIndex) => {
      expect(row).toHaveTextContent(responseValues.rows[rowIndex].rowName);

      const options = screen.getAllByTestId(
        new RegExp(`^${dataTestid}-row-${rowIndex}-option-\\d+$`),
      );
      expect(options).toHaveLength(2);

      options.forEach((option, optionIndex) => {
        const radio = within(option).getByRole('radio');
        expect(radio).toBeInTheDocument();
        expect(radio).toBeDisabled();
        expect(radio).toHaveAttribute('value', responseValues.options[optionIndex].text);
        const value = radio.getAttribute('value');
        value === answer.value[rowIndex]
          ? expect(radio).toBeChecked()
          : expect(radio).not.toBeChecked();
      });
    });
  });

  test('renders component for isMultuple = false', () => {
    const answer = {
      value: [
        ['', ''],
        ['Option 1', 'Option 2'],
      ],
    };
    renderWithProviders(
      <ItemRows
        responseValues={responseValues}
        answer={answer}
        data-testid={dataTestid}
        isMultiple
      />,
    );

    const rows = screen.getAllByTestId(new RegExp(`^${dataTestid}-row-\\d+$`));
    expect(rows).toHaveLength(2);

    rows.forEach((row, rowIndex) => {
      expect(row).toHaveTextContent(responseValues.rows[rowIndex].rowName);

      const options = screen.getAllByTestId(
        new RegExp(`^${dataTestid}-row-${rowIndex}-option-\\d+$`),
      );
      expect(options).toHaveLength(2);

      options.forEach((option, optionIndex) => {
        const checkbox = within(option).getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toBeDisabled();
        expect(checkbox).toHaveAttribute('value', responseValues.options[optionIndex].text);
        const value = checkbox.getAttribute('value');
        value && answer.value[rowIndex].includes(value)
          ? expect(checkbox).toBeChecked()
          : expect(checkbox).not.toBeChecked();
      });
    });
  });
});
