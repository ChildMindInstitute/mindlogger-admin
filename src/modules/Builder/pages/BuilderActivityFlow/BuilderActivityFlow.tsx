import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, generatePath } from 'react-router-dom';

import { StyledDirectoryUpButton, StyledBody } from 'shared/styles/styledComponents';
import { LinkedTabs, Svg } from 'shared/components';
import { page } from 'resources';
import { useCurrentActivityFlow, useCustomFormContext } from 'modules/Builder/hooks';

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
      !!getFieldState(`${fieldName}.name`).error ||
      !!getFieldState(`${fieldName}.description`).error,
    hasActivityFlowBuilderErrors: !!getFieldState(`${fieldName}.items`).error,
  };

  return (
    <StyledBody sx={{ position: 'relative' }}>
      <StyledDirectoryUpButton
        variant="text"
        onClick={handleBackBtnClick}
        startIcon={<Svg id="directory-up" width="18" height="18" />}
      >
        {t('activityFlows')}
      </StyledDirectoryUpButton>
      <LinkedTabs tabs={getActivityFlowTabs({ appletId, activityFlowId }, tabErrors)} isBuilder />
    </StyledBody>
  );
};
