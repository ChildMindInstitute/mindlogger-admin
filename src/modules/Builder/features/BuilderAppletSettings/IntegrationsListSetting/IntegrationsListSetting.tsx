import { useTranslation } from 'react-i18next';

import { useFeatureFlags } from 'shared/hooks';
import { StyledHeadline, variables } from 'shared/styles';

import { LorisIntegration } from './Integrations';
import { StyledIntegrationContainer } from './IntegrationsListSetting.styles';

export const IntegrationsListSetting = () => {
  const { t } = useTranslation('app');
  const {
    featureFlags: { enableLorisIntegration },
  } = useFeatureFlags();

  const isAnyIntegrationEnabled = enableLorisIntegration;

  return (
    <>
      <StyledIntegrationContainer isAnyIntegrationEnabled={isAnyIntegrationEnabled}>
        {enableLorisIntegration && <LorisIntegration />}
        {!isAnyIntegrationEnabled && (
          <StyledHeadline color={variables.palette.outline}>
            {t('noIntegrationsFound')}
          </StyledHeadline>
        )}
      </StyledIntegrationContainer>
    </>
  );
};
