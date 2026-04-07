import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { PasswordRequirementsTooltip } from './PasswordRequirementsTooltip';

describe('PasswordRequirementsTooltip', () => {
  test('renders the info icon', () => {
    const { getByTestId } = renderWithProviders(<PasswordRequirementsTooltip password="" />);

    expect(getByTestId('password-requirements-info')).toBeInTheDocument();
  });

  test('shows tooltip content on hover', async () => {
    const { getByTestId } = renderWithProviders(<PasswordRequirementsTooltip password="" />);

    await userEvent.hover(getByTestId('password-requirements-info'));

    expect(await screen.findByText('Password must include:')).toBeInTheDocument();
    expect(screen.getByText('At least 3 of the below 4 types')).toBeInTheDocument();
    expect(screen.getByText('10 characters')).toBeInTheDocument();
    expect(screen.getByText('no blank spaces')).toBeInTheDocument();
    expect(screen.getByText('Uppercase letters (A-Z)')).toBeInTheDocument();
    expect(screen.getByText('Lowercase letters (a-z)')).toBeInTheDocument();
    expect(screen.getByText('Numbers (0-9)')).toBeInTheDocument();
    expect(screen.getByText('Symbols (!@#$...)')).toBeInTheDocument();
  });

  test('shows all requirements as unmet for empty password', async () => {
    const { getByTestId } = renderWithProviders(<PasswordRequirementsTooltip password="" />);

    await userEvent.hover(getByTestId('password-requirements-info'));
    await screen.findByText('Password must include:');

    const items = [
      'password-req-10-characters',
      'password-req-no-blank-spaces',
      'password-req-uppercase-letters-(a-z)',
      'password-req-lowercase-letters-(a-z)',
      'password-req-numbers-(0-9)',
      'password-req-symbols-(!@#$...)',
    ];

    for (const testId of items) {
      expect(screen.getByTestId(testId)).toHaveTextContent('✗');
    }
  });

  test('shows requirements as met for a fully compliant password', async () => {
    const { getByTestId } = renderWithProviders(
      <PasswordRequirementsTooltip password="Str0ngPass!" />,
    );

    await userEvent.hover(getByTestId('password-requirements-info'));
    await screen.findByText('Password must include:');

    const items = [
      'password-req-10-characters',
      'password-req-no-blank-spaces',
      'password-req-uppercase-letters-(a-z)',
      'password-req-lowercase-letters-(a-z)',
      'password-req-numbers-(0-9)',
      'password-req-symbols-(!@#$...)',
    ];

    for (const testId of items) {
      expect(screen.getByTestId(testId)).toHaveTextContent('✓');
    }
  });

  test('shows mixed met/unmet for partial password', async () => {
    const { getByTestId } = renderWithProviders(
      <PasswordRequirementsTooltip password="abcdefghij" />,
    );

    await userEvent.hover(getByTestId('password-requirements-info'));
    await screen.findByText('Password must include:');

    // Met
    expect(screen.getByTestId('password-req-10-characters')).toHaveTextContent('✓');
    expect(screen.getByTestId('password-req-no-blank-spaces')).toHaveTextContent('✓');
    expect(screen.getByTestId('password-req-lowercase-letters-(a-z)')).toHaveTextContent('✓');

    // Not met
    expect(screen.getByTestId('password-req-uppercase-letters-(a-z)')).toHaveTextContent('✗');
    expect(screen.getByTestId('password-req-numbers-(0-9)')).toHaveTextContent('✗');
    expect(screen.getByTestId('password-req-symbols-(!@#$...)')).toHaveTextContent('✗');
  });
});
