import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { StyledDirectoryUpButton, StyledBody } from 'shared/styles/styledComponents';
import { LinkedTabs, Svg } from 'shared/components';
import { useBreadcrumbs } from 'shared/hooks';
import { page } from 'resources';

import { newActivityTabs } from './BuilderActivity.const';

export const BuilderActivity = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  useBreadcrumbs();

  return (
    <StyledBody sx={{ position: 'relative' }}>
      <StyledDirectoryUpButton
        variant="text"
        onClick={() => navigate(page.newAppletActivities)}
        startIcon={<Svg id="directory-up" width="18" height="18" />}
      >
        {t('activities')}
      </StyledDirectoryUpButton>
      <LinkedTabs tabs={newActivityTabs} />
    </StyledBody>
  );
};
