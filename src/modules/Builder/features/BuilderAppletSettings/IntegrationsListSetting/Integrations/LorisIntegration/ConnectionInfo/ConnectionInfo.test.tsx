import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { ConnectionInfo } from './ConnectionInfo';

// Mock the useLorisConnectionInfo hook
vi.mock('../LorisIntegration.hooks', () => ({
  useLorisConnectionInfo: () => ({
    hostname: '192.168.001',
    username: 'yxiao37',
    project: 'Healthy Dog Network',
  }),
}));

describe('ConnectionInfo', () => {
  test('renders the connection info correctly', () => {
    renderWithProviders(<ConnectionInfo />);

    expect(screen.getByTestId('connection-info')).toBeInTheDocument();

    expect(screen.getByText('LORIS Server Hostname')).toBeInTheDocument();
    expect(screen.getByText('192.168.001')).toBeInTheDocument();

    expect(screen.getByText('LORIS Username')).toBeInTheDocument();
    expect(screen.getByText('yxiao37')).toBeInTheDocument();

    expect(screen.getByText('LORIS Project Name')).toBeInTheDocument();
    expect(screen.getByText('Healthy Dog Network')).toBeInTheDocument();
  });
});
