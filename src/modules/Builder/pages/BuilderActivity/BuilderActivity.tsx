import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { StyledDirectoryUpButton, StyledBody } from 'shared/styles/styledComponents';
import { LinkedTabs, Svg } from 'shared/components';
import { useBreadcrumbs } from 'shared/hooks';
import { page } from 'resources';

import { getActivityTabs } from './BuilderActivity.utils';

export const BuilderActivity = () => {
  const { t } = useTranslation();
  const { activityId, appletId } = useParams();
  const navigate = useNavigate();
  useBreadcrumbs();

  return (
    <StyledBody sx={{ position: 'relative' }}>
      <StyledDirectoryUpButton
        variant="text"
        onClick={() => navigate(page.builderAppletActivities)}
        startIcon={<Svg id="directory-up" width="18" height="18" />}
      >
        {t('activities')}
      </StyledDirectoryUpButton>
      {activityId && <LinkedTabs tabs={getActivityTabs({ activityId, appletId })} />}
    </StyledBody>
  );
};
