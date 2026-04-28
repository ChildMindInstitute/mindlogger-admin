import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Box } from '@mui/material';
import { t } from 'i18next';
import { useForm } from 'react-hook-form';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import {
  ACCOUNT_PASSWORD_MIN_CHAR_TYPES,
  ACCOUNT_PASSWORD_MIN_LENGTH,
  DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS,
} from 'shared/consts';

import { PasswordRequirementsSection } from './PasswordRequirementsSection';

type TestFormValues = { password: string };

function FormHarness({
  defaultValues,
  children,
}: {
  defaultValues: TestFormValues;
  children: (props: {
    control: ReturnType<typeof useForm<TestFormValues>>['control'];
    trigger: ReturnType<typeof useForm<TestFormValues>>['trigger'];
    clearErrors: ReturnType<typeof useForm<TestFormValues>>['clearErrors'];
  }) => React.ReactNode;
}) {
  const { control, trigger, clearErrors } = useForm<TestFormValues>({ defaultValues });

  return <>{children({ control, trigger, clearErrors })}</>;
}

describe('PasswordRequirementsSection', () => {
  const noop = () => {};

  test('renders the section', () => {
    const { getByTestId } = renderWithProviders(
      <FormHarness defaultValues={{ password: '' }}>
        {({ control, trigger, clearErrors }) => (
          <PasswordRequirementsSection
            fieldName="password"
            control={control}
            trigger={trigger}
            clearErrors={clearErrors}
            delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
            setShowPasswordError={noop}
          />
        )}
      </FormHarness>,
    );

    expect(getByTestId('password-requirements-section')).toBeInTheDocument();
  });

  test('shows all requirements as unmet for empty password', async () => {
    const { getByTestId } = renderWithProviders(
      <FormHarness defaultValues={{ password: '' }}>
        {({ control, trigger, clearErrors }) => (
          <PasswordRequirementsSection
            fieldName="password"
            control={control}
            trigger={trigger}
            clearErrors={clearErrors}
            delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
            setShowPasswordError={noop}
          />
        )}
      </FormHarness>,
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
      <FormHarness defaultValues={{ password: 'Str0ngPass!' }}>
        {({ control, trigger, clearErrors }) => (
          <PasswordRequirementsSection
            fieldName="password"
            control={control}
            trigger={trigger}
            clearErrors={clearErrors}
            delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
            setShowPasswordError={noop}
          />
        )}
      </FormHarness>,
    );

    await userEvent.hover(getByTestId('password-requirements-section'));
    await screen.findByText(t('passwordRequirementsMet'));
  });

  test('shows mixed met/unmet for partial password', async () => {
    const { getByTestId } = renderWithProviders(
      <FormHarness defaultValues={{ password: 'abcdefghij' }}>
        {({ control, trigger, clearErrors }) => (
          <PasswordRequirementsSection
            fieldName="password"
            control={control}
            trigger={trigger}
            clearErrors={clearErrors}
            delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
            setShowPasswordError={noop}
          />
        )}
      </FormHarness>,
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
        <FormHarness defaultValues={{ password: '' }}>
          {({ control, trigger, clearErrors }) => (
            <PasswordRequirementsSection
              fieldName="password"
              control={control}
              trigger={trigger}
              clearErrors={clearErrors}
              delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
              setShowPasswordError={noop}
            />
          )}
        </FormHarness>,
      );
      expect(screen.getByTestId('password-requirements-section')).toBeVisible();
    });
  });

  describe('with wrapper (children)', () => {
    it('hides the checklist when password is empty and nothing is focused', () => {
      renderWithProviders(
        <FormHarness defaultValues={{ password: '' }}>
          {({ control, trigger, clearErrors }) => (
            <PasswordRequirementsSection
              fieldName="password"
              control={control}
              trigger={trigger}
              clearErrors={clearErrors}
              delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
              setShowPasswordError={noop}
            >
              <input aria-label="New password" />
            </PasswordRequirementsSection>
          )}
        </FormHarness>,
      );
      expect(screen.getByTestId('password-requirements-section')).not.toBeVisible();
    });

    it('shows the checklist when the wrapped field is focused', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <FormHarness defaultValues={{ password: '' }}>
          {({ control, trigger, clearErrors }) => (
            <PasswordRequirementsSection
              fieldName="password"
              control={control}
              trigger={trigger}
              clearErrors={clearErrors}
              delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
              setShowPasswordError={noop}
            >
              <input aria-label="New password" />
            </PasswordRequirementsSection>
          )}
        </FormHarness>,
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
        <FormHarness defaultValues={{ password: '' }}>
          {({ control, trigger, clearErrors }) => (
            <Box display="flex" flexDirection="column" gap={2}>
              <PasswordRequirementsSection
                fieldName="password"
                control={control}
                trigger={trigger}
                clearErrors={clearErrors}
                delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
                setShowPasswordError={noop}
              >
                <input aria-label="New password" />
              </PasswordRequirementsSection>
              <input aria-label="Field outside password section" />
            </Box>
          )}
        </FormHarness>,
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
        <FormHarness defaultValues={{ password: 'short' }}>
          {({ control, trigger, clearErrors }) => (
            <PasswordRequirementsSection
              fieldName="password"
              control={control}
              trigger={trigger}
              clearErrors={clearErrors}
              delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
              setShowPasswordError={noop}
            >
              <input aria-label="New password" />
            </PasswordRequirementsSection>
          )}
        </FormHarness>,
      );
      expect(screen.getByTestId('password-requirements-section')).toBeVisible();
    });

    it('shows emoji error title when password contains emoji', async () => {
      renderWithProviders(
        <FormHarness defaultValues={{ password: 'Goodpas1😀!' }}>
          {({ control, trigger, clearErrors }) => (
            <PasswordRequirementsSection
              fieldName="password"
              control={control}
              trigger={trigger}
              clearErrors={clearErrors}
              delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
              setShowPasswordError={noop}
            >
              <input aria-label="New password" />
            </PasswordRequirementsSection>
          )}
        </FormHarness>,
      );
      expect(await screen.findByText(t('passwordCannotContainEmojis'))).toBeInTheDocument();
    });

    it('keeps the checklist visible without focus when password contains emoji', () => {
      renderWithProviders(
        <FormHarness defaultValues={{ password: 'Goodpas1😀!' }}>
          {({ control, trigger, clearErrors }) => (
            <PasswordRequirementsSection
              fieldName="password"
              control={control}
              trigger={trigger}
              clearErrors={clearErrors}
              delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
              setShowPasswordError={noop}
            >
              <input aria-label="New password" />
            </PasswordRequirementsSection>
          )}
        </FormHarness>,
      );
      expect(screen.getByTestId('password-requirements-section')).toBeVisible();
    });

    it('keeps the checklist visible without focus when password fails character-type rules', () => {
      renderWithProviders(
        <FormHarness defaultValues={{ password: 'onlyletterslongenough' }}>
          {({ control, trigger, clearErrors }) => (
            <PasswordRequirementsSection
              fieldName="password"
              control={control}
              trigger={trigger}
              clearErrors={clearErrors}
              delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
              setShowPasswordError={noop}
            >
              <input aria-label="New password" />
            </PasswordRequirementsSection>
          )}
        </FormHarness>,
      );
      expect(screen.getByTestId('password-requirements-section')).toBeVisible();
    });

    it('hides the checklist when password meets policy and nothing is focused', () => {
      renderWithProviders(
        <FormHarness defaultValues={{ password: 'Goodpass1!' }}>
          {({ control, trigger, clearErrors }) => (
            <PasswordRequirementsSection
              fieldName="password"
              control={control}
              trigger={trigger}
              clearErrors={clearErrors}
              delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
              setShowPasswordError={noop}
            >
              <input aria-label="New password" />
            </PasswordRequirementsSection>
          )}
        </FormHarness>,
      );
      expect(screen.getByTestId('password-requirements-section')).not.toBeVisible();
    });

    it('shows the checklist when password meets policy but the field is focused', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <FormHarness defaultValues={{ password: 'Goodpass1!' }}>
          {({ control, trigger, clearErrors }) => (
            <PasswordRequirementsSection
              fieldName="password"
              control={control}
              trigger={trigger}
              clearErrors={clearErrors}
              delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
              setShowPasswordError={noop}
            >
              <input aria-label="New password" />
            </PasswordRequirementsSection>
          )}
        </FormHarness>,
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
