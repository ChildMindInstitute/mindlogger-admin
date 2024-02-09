import { Badge } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, generatePath } from 'react-router-dom';

import { useCurrentActivityFlow, useCustomFormContext } from 'modules/Builder/hooks';
import { page } from 'resources';
import { LinkedTabs, Svg } from 'shared/components';
import { StyledDirectoryUpButton } from 'shared/styles/styledComponents';

import { StyledBuilderActivityFlowBody } from './BuilderActivityFlow.styles';
import { getActivityFlowTabs } from './BuilderActivityFlow.utils';

export const BuilderActivityFlow = () => {
  const { appletId, activityFlowId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { fieldName = '' } = useCurrentActivityFlow();
  const { trigger, getFieldState } = useCustomFormContext();

  const appletActivityFlowUrl = generatePath(page.builderAppletActivityFlow, { appletId });

  const handleBackBtnClick = async () => {
    await trigger();
    navigate(appletActivityFlowUrl);
  };

  const tabErrors = {
    hasAboutActivityFlowErrors:
      !!getFieldState(`${fieldName}.name`).error || !!getFieldState(`${fieldName}.description`).error,
    hasActivityFlowBuilderErrors: !!getFieldState(`${fieldName}.items`).error,
  };
  const hasAppletErrors = !!getFieldState('activities').error || !!getFieldState('displayName').error;

  return (
    <StyledBuilderActivityFlowBody sx={{ position: 'relative' }}>
      <StyledDirectoryUpButton
        variant="text"
        onClick={handleBackBtnClick}
        startIcon={<Svg id="directory-up" width="18" height="18" />}
      >
        {t('activityFlows')}
        <Badge variant="dot" invisible={!hasAppletErrors} color="error" />
      </StyledDirectoryUpButton>
      <LinkedTabs tabs={getActivityFlowTabs({ appletId, activityFlowId }, tabErrors)} isBuilder />
    </StyledBuilderActivityFlowBody>
  );
};
