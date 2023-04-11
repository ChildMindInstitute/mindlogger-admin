import { useFormContext } from 'react-hook-form';
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
  const { trigger } = useFormContext();
  useBreadcrumbs();

  const appletActivityFlowUrl = generatePath(page.builderAppletActivityFlow, { appletId });

  const handleBackBtnClick = async () => {
    await trigger();
    navigate(appletActivityFlowUrl);
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
      <LinkedTabs tabs={getActivityFlowTabs({ appletId, activityFlowId })} />
    </StyledBody>
  );
};
