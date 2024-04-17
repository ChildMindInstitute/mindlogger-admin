import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { ContainerHeader } from './ContainerHeader';

const mockOnClose = jest.fn();
const mockHeaderProps = {
  onClose: mockOnClose,
};

describe('ContainerHeader', () => {
  test('renders ContainerHeader with children and close button, calls onClose callback when close button is clicked', async () => {
    renderWithProviders(
      <ContainerHeader isSticky={false} headerProps={mockHeaderProps}>
        <div>Child Component</div>
      </ContainerHeader>,
    );

    expect(screen.getByText('Child Component')).toBeInTheDocument();

    const closeButton = screen.getByTestId('close-button');
    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);
    expect(mockOnClose).toBeCalled();
  });

  test('renders sticky ContainerHeader', () => {
    renderWithProviders(
      <ContainerHeader isSticky={true} headerProps={mockHeaderProps}>
        <div>Child Component</div>
      </ContainerHeader>,
    );

    const containerHeader = screen.getByTestId('container-header');
    expect(containerHeader).toHaveStyle({ position: 'sticky' });
  });
});
