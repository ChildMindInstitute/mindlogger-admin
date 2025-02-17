import { useFeatureFlags } from 'shared/hooks';

import { LorisIntegration } from './Integrations';
import { ProlificIntegration } from './Integrations/ProlificIntegration/ProlificIntegration';
import { StyledIntegrationContainer } from './IntegrationsListSetting.styles';

export const IntegrationsListSetting = () => {
  const { enableLorisIntegration, enableProlificIntegration } = useFeatureFlags().featureFlags;

  return (
    <>
      {enableLorisIntegration && (
        <StyledIntegrationContainer>
          <LorisIntegration />
        </StyledIntegrationContainer>
      )}

      {enableProlificIntegration && (
        <StyledIntegrationContainer data-testid="prolific-integration">
          <ProlificIntegration />
        </StyledIntegrationContainer>
      )}
    </>
  );
};
