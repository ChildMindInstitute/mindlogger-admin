import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { ServerNotConfigured } from './ServerNotConfigured';

const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}));

describe('ServerNotConfigured', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    renderWithProviders(<ServerNotConfigured appletId="testAppletId" data-testid="test" />);

    expect(
      screen.getByText('Server Status: Not Configured. Report can not be generated.'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('test-configure-report')).toBeInTheDocument();
  });

  test('navigates to the correct path on button click', async () => {
    renderWithProviders(<ServerNotConfigured appletId="testAppletId" data-testid="test" />);

    const button = screen.getByTestId('test-configure-report');
    await userEvent.click(button);

    expect(mockUseNavigate).toHaveBeenCalledWith(
      '/builder/testAppletId/settings/report-configuration',
    );
  });
});
