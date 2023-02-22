import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { LinkedTabs, Svg } from 'components';
import { useBreadcrumbs } from 'hooks';
import { StyledBody } from 'styles/styledComponents';

import { newAppletTabs, pathsWithInnerTabs } from './NewApplet.const';

export const NewApplet = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const hideHeader = pathsWithInnerTabs.some((path) => location.pathname.includes(path));

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
