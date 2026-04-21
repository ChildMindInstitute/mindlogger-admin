import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Box } from '@mui/material';
import { t } from 'i18next';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import {
  ACCOUNT_PASSWORD_MIN_CHAR_TYPES,
  ACCOUNT_PASSWORD_MIN_LENGTH,
  DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS,
} from 'shared/consts';

import { PasswordRequirementsSection } from './PasswordRequirementsSection';

describe('PasswordRequirementsSection', () => {
  test('renders the info icon', () => {
    const { getByTestId } = renderWithProviders(
      <PasswordRequirementsSection password="" delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS} />,
    );

    expect(getByTestId('password-requirements-section')).toBeInTheDocument();
  });

  test('shows all requirements as unmet for empty password', async () => {
    const { getByTestId } = renderWithProviders(
      <PasswordRequirementsSection password="" delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS} />,
    );

    await userEvent.hover(getByTestId('password-requirements-section'));

    expect(
      await screen.findByText(
        t('passwordMustInclude', {
          minLength: ACCOUNT_PASSWORD_MIN_LENGTH,
          types: ACCOUNT_PASSWORD_MIN_CHAR_TYPES,
        }),
      ),
    ).toBeInTheDocument();
  });

  test('shows requirements as met for a fully compliant password', async () => {
    const { getByTestId } = renderWithProviders(
      <PasswordRequirementsSection
        password="Str0ngPass!"
        delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
      />,
    );

    await userEvent.hover(getByTestId('password-requirements-section'));
    await screen.findByText(t('passwordRequirementsMet'));
  });

  test('shows mixed met/unmet for partial password', async () => {
    const { getByTestId } = renderWithProviders(
      <PasswordRequirementsSection
        password="abcdefghij"
        delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
      />,
    );

    await userEvent.hover(getByTestId('password-requirements-section'));
    await screen.findByText(
      t('passwordMustInclude', {
        minLength: ACCOUNT_PASSWORD_MIN_LENGTH,
        types: ACCOUNT_PASSWORD_MIN_CHAR_TYPES,
      }),
    );
  });

  describe('without wrapper (no children)', () => {
    it('renders the checklist visible', () => {
      renderWithProviders(
        <PasswordRequirementsSection
          password=""
          delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
        />,
      );
      expect(screen.getByTestId('password-requirements-section')).toBeVisible();
    });
  });

  describe('with wrapper (children)', () => {
    it('hides the checklist when password is empty and nothing is focused', () => {
      renderWithProviders(
        <PasswordRequirementsSection password="" delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}>
          <input aria-label="New password" />
        </PasswordRequirementsSection>,
      );
      expect(screen.getByTestId('password-requirements-section')).not.toBeVisible();
    });

    it('shows the checklist when the wrapped field is focused', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <PasswordRequirementsSection password="" delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}>
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
          <PasswordRequirementsSection password="" delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}>
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
        <PasswordRequirementsSection
          password="short"
          delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
        >
          <input aria-label="New password" />
        </PasswordRequirementsSection>,
      );
      expect(screen.getByTestId('password-requirements-section')).toBeVisible();
    });

    it('keeps the checklist visible without focus when password fails character-type rules', () => {
      renderWithProviders(
        <PasswordRequirementsSection
          password="onlyletterslongenough"
          delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
        >
          <input aria-label="New password" />
        </PasswordRequirementsSection>,
      );
      expect(screen.getByTestId('password-requirements-section')).toBeVisible();
    });

    it('hides the checklist when password meets policy and nothing is focused', () => {
      renderWithProviders(
        <PasswordRequirementsSection
          password="Goodpass1!"
          delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
        >
          <input aria-label="New password" />
        </PasswordRequirementsSection>,
      );
      expect(screen.getByTestId('password-requirements-section')).not.toBeVisible();
    });

    it('shows the checklist when password meets policy but the field is focused', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <PasswordRequirementsSection
          password="Goodpass1!"
          delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
        >
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
