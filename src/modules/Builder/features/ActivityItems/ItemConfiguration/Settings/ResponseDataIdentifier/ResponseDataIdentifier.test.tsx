import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

import { ResponseDataIdentifier } from './ResponseDataIdentifier';

const onRemoveMock = jest.fn();

describe('ResponseDataIdentifier Component', () => {
  test('renders component with correct labels and calls onRemove callback when remove button is clicked', () => {
    renderWithProviders(<ResponseDataIdentifier onRemove={onRemoveMock} />);

    expect(screen.getByText('Response Data Identifier')).toBeInTheDocument();
    expect(
      screen.getByText(
        // eslint-disable-next-line quotes
        "Respondent will be required to enter response data identifier text into the field. The text entered will identify the response data collected at that point in time. The identifier used will be filterable on the respondent's data visualization tab.",
      ),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByTestId('builder-activity-items-item-configuration-data-indentifier-remove'),
    );

    expect(onRemoveMock).toHaveBeenCalledTimes(1);
  });
});
