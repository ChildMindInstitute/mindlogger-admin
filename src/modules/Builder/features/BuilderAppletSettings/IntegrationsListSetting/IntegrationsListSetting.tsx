import { LorisIntegration } from './Integrations';
import { ProlificIntegration } from './Integrations/ProlificIntegration/ProlificIntegration';
import { StyledIntegrationContainer } from './IntegrationsListSetting.styles';
import { IntegrationSettings } from './IntegrationsListSetting.types';

export const IntegrationsListSetting = ({
  lorisIntegration,
  prolificIntegration,
}: IntegrationSettings) => (
  <>
    {lorisIntegration && (
      <StyledIntegrationContainer>
        <LorisIntegration />
      </StyledIntegrationContainer>
    )}

    {prolificIntegration && (
      <StyledIntegrationContainer>
        <ProlificIntegration />
      </StyledIntegrationContainer>
    )}
  </>
);
