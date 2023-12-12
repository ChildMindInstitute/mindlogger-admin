import { render, fireEvent } from '@testing-library/react';

import { ToggleItemContainer } from '.';

const dataTestId = 'toggle-item-container';

describe('ToggleItemContainer', () => {
  test('should toggle content visibility on button click and errorMessage visible', () => {
    const { getByTestId, queryByText } = render(
      <ToggleItemContainer
        title="Test Title"
        Content={() => <div>Test Content</div>}
        hasError
        errorMessage="errorFallback.somethingWentWrong"
        data-testid={dataTestId}
      />,
    );

    expect(queryByText('Test Content')).toBeInTheDocument();

    const toggleButton = getByTestId(`${dataTestId}-collapse`);
    fireEvent.click(toggleButton);
    expect(queryByText('Test Content')).not.toBeInTheDocument();
    expect(queryByText('Something went wrong.')).toBeInTheDocument();
  });

  test('should not toggle content when disabled', () => {
    const { getByTestId, queryByText } = render(
      <ToggleItemContainer
        isOpenDisabled
        title="Disabled Title"
        Content={() => <div>Disabled Content</div>}
        data-testid={dataTestId}
      />,
    );

    expect(queryByText('Disabled Content')).toBeInTheDocument();

    const toggleButton = getByTestId(`${dataTestId}-collapse`);
    fireEvent.click(toggleButton);
    expect(queryByText('Disabled Content')).toBeInTheDocument();
  });
});
