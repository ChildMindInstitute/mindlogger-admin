import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, generatePath } from 'react-router-dom';

import { StyledDirectoryUpButton, StyledBody } from 'shared/styles/styledComponents';
import { LinkedTabs, Svg } from 'shared/components';
import { useBreadcrumbs } from 'shared/hooks';
import { page } from 'resources';

import { getActivityFlowTabs } from './BuilderActivityFlow.utils';

export const BuilderActivityFlow = () => {
  const { appletId, activityFlowId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  useBreadcrumbs();

  const appletActivityFlowUrl = generatePath(page.builderAppletActivityFlow, { appletId });

  return (
    <StyledBody sx={{ position: 'relative' }}>
      <StyledDirectoryUpButton
        variant="text"
        onClick={() => navigate(appletActivityFlowUrl)}
        startIcon={<Svg id="directory-up" width="18" height="18" />}
      >
        {t('activityFlows')}
      </StyledDirectoryUpButton>
      <LinkedTabs tabs={getActivityFlowTabs({ appletId, activityFlowId })} />
    </StyledBody>
  );
};
