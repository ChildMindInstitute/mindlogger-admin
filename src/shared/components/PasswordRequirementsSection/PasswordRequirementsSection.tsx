import { useTranslation } from 'react-i18next';
import { ACCOUNT_PASSWORD_MIN_LENGTH, ACCOUNT_PASSWORD_MIN_CHAR_TYPES } from 'shared/consts';
import { checkPassword, isAccountPasswordPolicySatisfied } from 'shared/utils/passwordValidation';

import {
  StyledSection,
  StyledSectionTitle,
  StyledGrid,
  StyledRequirement,
} from './PasswordRequirementsSection.styles';
import { useState } from 'react';
import Box from '@mui/material/Box';

const CheckMark = () => <span>&#x2713;</span>;
const CrossMark = () => <span>&#x2717;</span>;

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
  * If passed, wraps fields + checklist. The checklist shows while a descendant has focus, or while
  * `password` is non-empty and still fails account policy (stable while typing despite debounced validation).
 */
  children?: React.ReactNode;
}

export const PasswordRequirementsSection = ({ password, children }: PasswordRequirementsSectionProps) => {
  const [focusWithin, setFocusWithin] = useState(false)
  const { t } = useTranslation();

  const result = checkPassword(password);

  const checklist = (
    <div data-testid="password-requirements-section">
      <StyledSection>
        <StyledSectionTitle>{t('passwordMustInclude')}</StyledSectionTitle>
        <StyledGrid>
          <RequirementItem
            met={result.meetsLength}
            label={t('passwordReqLength', { chars: ACCOUNT_PASSWORD_MIN_LENGTH })}
          />
          <RequirementItem met={result.hasNoSpaces} label={t('passwordReqNoSpaces')} />
        </StyledGrid>
      </StyledSection>
      <StyledSection>
        <StyledSectionTitle>
          {t('passwordReqCharTypesHeading', { types: ACCOUNT_PASSWORD_MIN_CHAR_TYPES })}
        </StyledSectionTitle>
        <StyledGrid>
          <RequirementItem met={result.hasUppercase || result.meetsCharTypeRequirement} label={t('passwordReqUppercase')} />
          <RequirementItem met={result.hasLowercase || result.meetsCharTypeRequirement} label={t('passwordReqLowercase')} />
          <RequirementItem met={result.hasDigit || result.meetsCharTypeRequirement} label={t('passwordReqNumbers')} />
          <RequirementItem met={result.hasSymbol || result.meetsCharTypeRequirement} label={t('passwordReqSymbols')} />
        </StyledGrid>
      </StyledSection>
    </div>
  );

  if (children !== undefined) {
    const keepChecklistVisible = password.length > 0 && !isAccountPasswordPolicySatisfied(result)
    const showPasswordPanel = focusWithin || keepChecklistVisible

    const handleBlurCapture = (e: React.FocusEvent<HTMLDivElement>) => {
      const next = e.relatedTarget as Node | null
      if (next && e.currentTarget.contains(next)) return
      setFocusWithin(false)
    }

    return (
      <Box
        data-testid="password-requirements-field-group"
        display="flex"
        flexDirection="column"
        onFocusCapture={() => setFocusWithin(true)}
        onBlurCapture={handleBlurCapture}
        sx={{
          '& > .password-requirements-panel': {
            minHeight: 0,
            overflow: 'hidden',
            transition:
              'opacity 0.2s ease-in-out, max-height 0.25s ease-in-out, margin-top 0.2s ease-in-out',
            ...(showPasswordPanel // Show the password requirements panel when the user is inside the component or the password still fails account policy.
              ? { opacity: 1, maxHeight: 320, marginTop: 0, marginBottom: '24px' }
              : { opacity: 0, maxHeight: 0, marginTop: 0, marginBottom: 0 }),
          },
        }}
      >
        <Box display="flex" flexDirection="column" gap="24px">
          {children}
        </Box>
        <Box className="password-requirements-panel" data-testid="password-requirements-panel">
          {checklist}
        </Box>
      </Box>
    )
  }

  return checklist;
};