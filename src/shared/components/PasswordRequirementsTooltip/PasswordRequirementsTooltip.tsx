import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { ACCOUNT_PASSWORD_MIN_LENGTH, ACCOUNT_PASSWORD_MIN_CHAR_TYPES } from 'shared/consts';
import { checkPassword } from 'shared/utils/passwordValidation';

import {
  StyledPasswordTooltip,
  StyledSection,
  StyledSectionTitle,
  StyledGrid,
  StyledRequirement,
  StyledInfoIcon,
} from './PasswordRequirementsTooltip.styles';

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

interface PasswordRequirementsTooltipProps {
  password: string;
}

export const PasswordRequirementsTooltip = ({ password }: PasswordRequirementsTooltipProps) => {
  const { t } = useTranslation();

  const result = checkPassword(password);

  const tooltipContent = (
    <>
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
          <RequirementItem met={result.hasUppercase} label={t('passwordReqUppercase')} />
          <RequirementItem met={result.hasLowercase} label={t('passwordReqLowercase')} />
          <RequirementItem met={result.hasDigit} label={t('passwordReqNumbers')} />
          <RequirementItem met={result.hasSymbol} label={t('passwordReqSymbols')} />
        </StyledGrid>
      </StyledSection>
    </>
  );

  return (
    <StyledPasswordTooltip title={tooltipContent} placement="right">
      <StyledInfoIcon data-testid="password-requirements-info">
        <Svg id="more-info-outlined" />
      </StyledInfoIcon>
    </StyledPasswordTooltip>
  );
};
