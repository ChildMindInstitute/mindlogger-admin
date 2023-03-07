import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { LinkedTabs, Svg } from 'shared/components';
import { useBreadcrumbs } from 'shared/hooks';
import { StyledBody } from 'shared/styles/styledComponents';

import { newAppletTabs, pathsWithInnerTabs } from './NewApplet.const';

export const NewApplet = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const hiddenHeader = pathsWithInnerTabs.some((path) => location.pathname.includes(path));

  useBreadcrumbs([
    {
      icon: <Svg id="applet-outlined" width="18" height="18" />,
      label: t('newApplet'),
      disabledLink: true,
    },
  ]);

  return (
    <StyledBody>
      <LinkedTabs hiddenHeader={hiddenHeader} tabs={newAppletTabs} />
    </StyledBody>
  );
};
