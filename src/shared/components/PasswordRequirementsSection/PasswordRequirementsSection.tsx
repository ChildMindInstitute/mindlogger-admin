import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Box from '@mui/material/Box';

import { isAccountPasswordPolicySatisfied } from 'shared/utils/passwordValidation';

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

interface PasswordRequirementsSectionProps {
  password: string;

  /**
   * If passed, wraps fields + checklist. The panel uses live policy; title / grid hide / “met” copy
   * follow a short debounce after `password` stops changing.
   */
  children?: React.ReactNode;
  delayMs: number;
}

export const PasswordRequirementsSection = ({
  password,
  children,
  delayMs,
}: PasswordRequirementsSectionProps) => {
  const [focusWithin, setFocusWithin] = useState(false);
  const { t } = useTranslation();

  // Tracks if this is the first time the user has focused within the component.
  const [firstFocusWithin, setFirstFocusWithin] = useState(true);

  const {
    result,
    hideCharTypesGrid,
    displayPolicySatisfied,
    passwordRequirementsSectionTitleKey,
    isEmptyForDisplay,
  } = usePasswordRequirementsChecklistDisplay(password, delayMs);

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
          {t(passwordRequirementsSectionTitleKey)}
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
    const showPasswordPanel = focusWithin || keepChecklistVisible;

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
        display="flex"
        flexDirection="column"
        onFocusCapture={() => setFocusWithin(true)}
        onBlurCapture={handleBlurCapture}
        showPasswordPanel={showPasswordPanel}
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
