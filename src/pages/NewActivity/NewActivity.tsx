import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { DirectoryUpButton, StyledBody } from 'styles/styledComponents';
import { LinkedTabs, Svg } from 'components';
import { useBreadcrumbs } from 'hooks';
import { page } from 'resources';

import { newActivityTabs } from './NewActivity.const';

export const NewActivity = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  useBreadcrumbs();

  return (
    <StyledBody sx={{ position: 'relative' }}>
      <DirectoryUpButton
        variant="text"
        onClick={() => navigate(page.newAppletActivities)}
        startIcon={<Svg id="directory-up" width="18" height="18" />}
      >
        {t('activities')}
      </DirectoryUpButton>
      <LinkedTabs tabs={newActivityTabs} />
    </StyledBody>
  );
};
