import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ToggleItemContainer } from '.';

const dataTestId = 'toggle-item-container';

describe('ToggleItemContainer', () => {
  test('should toggle content visibility on button click and errorMessage visible', async () => {
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
    await userEvent.click(toggleButton);
    expect(queryByText('Test Content')).not.toBeInTheDocument();
    expect(queryByText('Something went wrong.')).toBeInTheDocument();
  });

  test('should toggle content visibility on header click with the property headerToggling: true', async () => {
    const { getByTestId, queryByText } = render(
      <ToggleItemContainer
        title="Test Title"
        Content={() => <div>Test Content</div>}
        headerToggling
        isOpenByDefault={false}
        data-testid={dataTestId}
      />,
    );

    expect(queryByText('Test Content')).not.toBeInTheDocument();

    const toggleHeader = getByTestId(`${dataTestId}-header`);
    await userEvent.click(toggleHeader);
    expect(queryByText('Test Content')).toBeInTheDocument();
    await userEvent.click(toggleHeader);
    expect(queryByText('Test Content')).not.toBeInTheDocument();
  });

  test('should not toggle content when disabled', async () => {
    const { getByTestId, queryByText } = render(
      <ToggleItemContainer
        isOpenDisabled
        headerToggling
        title="Disabled Title"
        Content={() => <div>Disabled Content</div>}
        data-testid={dataTestId}
      />,
    );

    expect(queryByText('Disabled Content')).toBeInTheDocument();

    const toggleButton = getByTestId(`${dataTestId}-collapse`);
    expect(toggleButton).toBeDisabled();
    const toggleHeader = getByTestId(`${dataTestId}-header`);
    await userEvent.click(toggleHeader);
    expect(queryByText('Disabled Content')).toBeInTheDocument();
  });
});
