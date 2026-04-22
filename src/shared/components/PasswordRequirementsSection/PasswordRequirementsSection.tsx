import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Control,
  FieldValues,
  Path,
  UseFormClearErrors,
  UseFormTrigger,
  useFormState,
  useWatch,
} from 'react-hook-form';
import Box from '@mui/material/Box';

import { isAccountPasswordPolicySatisfied } from 'shared/utils/passwordValidation';
import {
  ACCOUNT_PASSWORD_MIN_CHAR_TYPES,
  ACCOUNT_PASSWORD_MIN_LENGTH,
  DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS,
} from 'shared/consts';

import {
  StyledSection,
  StyledSectionTitle,
  StyledGrid,
  StyledRequirement,
  PasswordRequirementsSectionState,
  PasswordRequirementsFieldGroup,
} from './PasswordRequirementsSection.styles';
import { usePasswordRequirementsChecklistDisplay } from './usePasswordRequirementsChecklistDisplay';

const CheckMark = () => <span>&#x2713;</span>;
const CrossMark = () => <span>&#x2717;</span>;

function getPasswordRequirementsSectionState(
  firstFocusWithin: boolean,
  isPasswordEmpty: boolean,
  policySatisfiedForDisplay: boolean,
): PasswordRequirementsSectionState {
  if (policySatisfiedForDisplay) {
    return PasswordRequirementsSectionState.MET;
  }
  if (firstFocusWithin || isPasswordEmpty) {
    return PasswordRequirementsSectionState.FOCUSED;
  }

  return PasswordRequirementsSectionState.ERROR;
}

const RequirementItem = ({ met, label }: { met: boolean; label: string }) => (
  <StyledRequirement
    met={met}
    data-testid={`password-req-${label.replaceAll(' ', '-').toLowerCase()}`}
  >
    {met ? <CheckMark /> : <CrossMark />} {label}
  </StyledRequirement>
);

interface PasswordRequirementsSectionProps<T extends FieldValues> {
  /**
   * If passed, wraps fields + checklist. The panel uses live policy; title / grid hide / "met" copy
   * follow a short debounce after `password` stops changing.
   */
  children?: React.ReactNode;
  delayMs: number;
  setShowPasswordError: (showPasswordError: boolean) => void;
  fieldName: Path<T>;
  control: Control<T>;
  trigger: UseFormTrigger<T>;
  clearErrors: UseFormClearErrors<T>;
}

export const PasswordRequirementsSection = <T extends FieldValues>({
  children,
  delayMs,
  setShowPasswordError,
  fieldName,
  control,
  trigger,
  clearErrors,
}: PasswordRequirementsSectionProps<T>) => {
  // If focusWithin is true, the user is inside the component and the checklist should be visible.
  const [focusWithin, setFocusWithin] = useState(false);
  const { t } = useTranslation();

  // Tracks if this is the first time the user has focused within the component.
  const [firstFocusWithin, setFirstFocusWithin] = useState(true);

  const passwordValue = useWatch({ control, name: fieldName });
  const { isSubmitting } = useFormState({ control });

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!passwordValue) {
        clearErrors(fieldName);

        return;
      }

      // We only want to show the input's error if the user has not typed anything yet,
      // otherwise all errors are shown using the password requirements section
      setShowPasswordError(false);

      if (!firstFocusWithin) {
        await trigger(fieldName);
      }
    }, DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [passwordValue, trigger, clearErrors, firstFocusWithin, fieldName, setShowPasswordError]);

  useEffect(() => {
    if (isSubmitting && !passwordValue) {
      setShowPasswordError(true);
    }
  }, [isSubmitting, passwordValue, setShowPasswordError]);

  const {
    result,
    hideCharTypesGrid,
    displayPolicySatisfied,
    passwordRequirementsSectionTitleKey,
    isEmptyForDisplay,
  } = usePasswordRequirementsChecklistDisplay(String(passwordValue ?? ''), delayMs);

  const checklist = (
    <div data-testid="password-requirements-section">
      <StyledSection>
        <StyledSectionTitle
          state={getPasswordRequirementsSectionState(
            firstFocusWithin,
            isEmptyForDisplay,
            displayPolicySatisfied,
          )}
        >
          {t(passwordRequirementsSectionTitleKey, {
            minLength: ACCOUNT_PASSWORD_MIN_LENGTH,
            types: ACCOUNT_PASSWORD_MIN_CHAR_TYPES,
          })}
        </StyledSectionTitle>

        {!hideCharTypesGrid && (
          <StyledSection>
            <StyledGrid>
              <RequirementItem met={result.hasUppercase} label={t('passwordReqUppercase')} />
              <RequirementItem met={result.hasLowercase} label={t('passwordReqLowercase')} />
              <RequirementItem met={result.hasDigit} label={t('passwordReqNumbers')} />
              <RequirementItem met={result.hasSymbol} label={t('passwordReqSymbols')} />
            </StyledGrid>
          </StyledSection>
        )}
      </StyledSection>
    </div>
  );

  if (children !== undefined) {
    // Open panel without focus if they typed something invalid (uses live rules, not debounced UI).
    const keepChecklistVisible = !isEmptyForDisplay && !isAccountPasswordPolicySatisfied(result);
    const showPasswordPanel = keepChecklistVisible || focusWithin;

    const handleBlurCapture = (e: React.FocusEvent<HTMLDivElement>) => {
      const next = e.relatedTarget as Node | null;
      if (next && e.currentTarget.contains(next)) return;
      setFocusWithin(false);

      // Set to false so the checklist shows error status when the user focuses back in.
      setFirstFocusWithin(false);
    };

    return (
      <PasswordRequirementsFieldGroup
        data-testid="password-requirements-field-group"
        showPasswordPanel={showPasswordPanel}
        onFocusCapture={() => {
          setFocusWithin(true);
          setShowPasswordError(false);
        }}
        onBlurCapture={handleBlurCapture}
      >
        <Box display="flex" flexDirection="column" gap="24px">
          {children}
        </Box>
        <Box className="password-requirements-panel" data-testid="password-requirements-panel">
          {checklist}
        </Box>
      </PasswordRequirementsFieldGroup>
    );
  }

  return checklist;
};
