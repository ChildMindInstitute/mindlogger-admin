import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { StyledDirectoryUpButton, StyledBody } from 'styles/styledComponents';
import { LinkedTabs, Svg } from 'components';
import { useBreadcrumbs } from 'hooks';
import { page } from 'resources';

import { newActivityFlowTabs } from './NewActivityFlow.const';

export const NewActivityFlow = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  useBreadcrumbs();

  return (
    <StyledBody sx={{ position: 'relative' }}>
      <StyledDirectoryUpButton
        variant="text"
        onClick={() => navigate(page.newAppletActivityFlow)}
        startIcon={<Svg id="directory-up" width="18" height="18" />}
      >
        {t('activityFlows')}
      </StyledDirectoryUpButton>
      <LinkedTabs tabs={newActivityFlowTabs} />
    </StyledBody>
  );
};
