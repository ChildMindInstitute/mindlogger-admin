import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { LinkedTabs, Svg } from 'components';
import { useBreadcrumbs } from 'hooks';
import { page } from 'resources';
import { StyledBody } from 'styles/styledComponents';

import { newAppletTabs } from './NewApplet.const';

export const NewApplet = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const hideHeader = location.pathname.includes(page.newAppletNewActivityFlow);

  useBreadcrumbs([
    {
      icon: <Svg id="applet-outlined" width="18" height="18" />,
      label: t('newApplet'),
      disabledLink: true,
    },
  ]);

  return (
    <StyledBody>
      <LinkedTabs hideHeader={hideHeader} tabs={newAppletTabs} />
    </StyledBody>
  );
};
