import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { PasswordRequirementsSection } from './PasswordRequirementsSection';
import { Box } from '@mui/material';

describe('PasswordRequirementsSection', () => {
  test('renders the info icon', () => {
    const { getByTestId } = renderWithProviders(<PasswordRequirementsSection password="" />);

    expect(getByTestId('password-requirements-section')).toBeInTheDocument();
  });

  test('shows tooltip content on hover', async () => {
    const { getByTestId } = renderWithProviders(<PasswordRequirementsSection password="" />);

    await userEvent.hover(getByTestId('password-requirements-section'));

    expect(await screen.findByText('Password must include:')).toBeInTheDocument();
    expect(screen.getByText('At least 3 of the types below')).toBeInTheDocument();
    expect(screen.getByText('10 characters')).toBeInTheDocument();
    expect(screen.getByText('no blank spaces')).toBeInTheDocument();
    expect(screen.getByText('Uppercase letters (A-Z)')).toBeInTheDocument();
    expect(screen.getByText('Lowercase letters (a-z)')).toBeInTheDocument();
    expect(screen.getByText('Numbers (0-9)')).toBeInTheDocument();
    expect(screen.getByText('Symbols (!@#$...)')).toBeInTheDocument();
  });

  test('shows all requirements as unmet for empty password', async () => {
    const { getByTestId } = renderWithProviders(<PasswordRequirementsSection password="" />);

    await userEvent.hover(getByTestId('password-requirements-section'));
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
      <PasswordRequirementsSection password="Str0ngPass!" />,
    );

    await userEvent.hover(getByTestId('password-requirements-section'));
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
      <PasswordRequirementsSection password="abcdefghij" />,
    );

    await userEvent.hover(getByTestId('password-requirements-section'));
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

  describe('without wrapper (no children)', () => {
    it('renders the checklist visible', () => {
      renderWithProviders(<PasswordRequirementsSection password="" />);
      expect(screen.getByTestId('password-requirements-section')).toBeVisible();
    });
  });

  describe('with wrapper (children)', () => {
    it('hides the checklist when password is empty and nothing is focused', () => {
      renderWithProviders(
        <PasswordRequirementsSection password="">
          <input aria-label="New password" />
        </PasswordRequirementsSection>,
      );
      expect(screen.getByTestId('password-requirements-section')).not.toBeVisible();
    });

    it('shows the checklist when the wrapped field is focused', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <PasswordRequirementsSection password="">
          <input aria-label="New password" />
        </PasswordRequirementsSection>,
      );
      const input = screen.getByLabelText('New password');
      await user.click(input);
      expect(input).toHaveFocus();
      await waitFor(() => {
        expect(screen.getByTestId('password-requirements-section')).toBeVisible();
      });
    });

    it('hides the checklist after blur when password is still empty', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <Box display="flex" flexDirection="column" gap={2}>
          <PasswordRequirementsSection password="">
            <input aria-label="New password" />
          </PasswordRequirementsSection>
          <input aria-label="Field outside password section" />
        </Box>,
      );
      await user.click(screen.getByLabelText('New password'));
      await waitFor(() => {
        expect(screen.getByTestId('password-requirements-section')).toBeVisible();
      });
      await user.click(screen.getByLabelText('Field outside password section'));
      await waitFor(() => {
        expect(screen.getByTestId('password-requirements-section')).not.toBeVisible();
      });
    });

    it('keeps the checklist visible without focus when password fails length', () => {
      renderWithProviders(
        <PasswordRequirementsSection password="short">
          <input aria-label="New password" />
        </PasswordRequirementsSection>,
      );
      expect(screen.getByTestId('password-requirements-section')).toBeVisible();
    });

    it('keeps the checklist visible without focus when password fails character-type rules', () => {
      renderWithProviders(
        <PasswordRequirementsSection password="onlyletterslongenough">
          <input aria-label="New password" />
        </PasswordRequirementsSection>,
      );
      expect(screen.getByTestId('password-requirements-section')).toBeVisible();
    });

    it('hides the checklist when password meets policy and nothing is focused', () => {
      renderWithProviders(
        <PasswordRequirementsSection password="Goodpass1!">
          <input aria-label="New password" />
        </PasswordRequirementsSection>,
      );
      expect(screen.getByTestId('password-requirements-section')).not.toBeVisible();
    });

    it('shows the checklist when password meets policy but the field is focused', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <PasswordRequirementsSection password="Goodpass1!">
          <input aria-label="New password" />
        </PasswordRequirementsSection>,
      );
      const input = screen.getByLabelText('New password');
      await user.click(input);
      expect(input).toHaveFocus();
      await waitFor(() => {
        expect(screen.getByTestId('password-requirements-section')).toBeVisible();
      });
    });
  });
});
