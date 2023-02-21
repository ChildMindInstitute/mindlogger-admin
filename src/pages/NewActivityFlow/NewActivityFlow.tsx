import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { StyledBody } from 'styles/styledComponents';
import { LinkedTabs, Svg } from 'components';
import { useBreadcrumbs } from 'hooks';
import { page } from 'resources';

import { newActivityFlowTabs } from './NewActivityFlow.const';
import { DirectoryUpButton } from './NewActivityFlow.styles';

export const NewActivityFlow = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  useBreadcrumbs();

  return (
    <StyledBody sx={{ position: 'relative' }}>
      <DirectoryUpButton
        variant="text"
        onClick={() => navigate(page.newAppletActivityFlow)}
        startIcon={<Svg id="directory-up" width="18" height="18" />}
      >
        {t('activityFlows')}
      </DirectoryUpButton>
      <LinkedTabs tabs={newActivityFlowTabs} />
    </StyledBody>
  );
};
