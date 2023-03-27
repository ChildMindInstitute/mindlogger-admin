import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { StyledBody, StyledDirectoryUpButton } from 'shared/styles/styledComponents';
import { LinkedTabs, Svg } from 'shared/components';
import { useBreadcrumbs } from 'shared/hooks';
import { page } from 'resources';

import { useRespondentDataTabs } from './RespondentData.hooks';

export const RespondentData = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  useBreadcrumbs();
  const respondentDataTabs = useRespondentDataTabs();

  return (
    <StyledBody sx={{ position: 'relative' }}>
      <StyledDirectoryUpButton
        variant="text"
        onClick={() => navigate(page.newAppletActivities)}
        startIcon={<Svg id="directory-up" width="18" height="18" />}
      >
        {t('appletPage')}
      </StyledDirectoryUpButton>
      <LinkedTabs tabs={respondentDataTabs} />
    </StyledBody>
  );
};
