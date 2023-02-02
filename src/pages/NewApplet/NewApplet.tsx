import { Svg } from 'components';
import { LinkedTabs } from 'components/Tabs';
import { useBreadcrumbs } from 'hooks';
import { StyledBody } from 'styles/styledComponents/Body';

import { newAppletTabs } from './NewApplet.const';

export const NewApplet = () => {
  useBreadcrumbs([
    {
      icon: <Svg id="applet-outlined" width="18" height="18" />,
      label: 'newApplet',
      disabledLink: true,
    },
  ]);

  return (
    <StyledBody>
      <LinkedTabs tabs={newAppletTabs} />
    </StyledBody>
  );
};
