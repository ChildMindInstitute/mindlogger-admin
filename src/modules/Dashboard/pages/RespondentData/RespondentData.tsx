import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { StyledBody, StyledDirectoryUpButton } from 'shared/styles/styledComponents';
import { LinkedTabs, Svg } from 'shared/components';
import { useBreadcrumbs } from 'shared/hooks';
import { APPLET_PAGES } from 'shared/consts';
import { page } from 'resources';

import { useRespondentDataTabs } from './RespondentData.hooks';

export const RespondentData = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  useBreadcrumbs();
  const respondentDataTabs = useRespondentDataTabs();

  const navigateUp = () => navigate(`${page.dashboard}/${id}/${APPLET_PAGES.respondents}`);

  return (
    <StyledBody sx={{ position: 'relative' }}>
      <StyledDirectoryUpButton
        variant="text"
        onClick={navigateUp}
        startIcon={<Svg id="directory-up" width="18" height="18" />}
      >
        {t('appletPage')}
      </StyledDirectoryUpButton>
      <LinkedTabs tabs={respondentDataTabs} />
    </StyledBody>
  );
};
