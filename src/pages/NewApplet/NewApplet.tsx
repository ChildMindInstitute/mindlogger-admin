import { LinkedTabs } from 'components/Tabs';
import { useBreadcrumbs } from 'hooks';
import { StyledBody } from 'styles/styledComponents/Body';

import { newAppletTabs } from './NewApplet.const';

export const NewApplet = () => {
  useBreadcrumbs();

  return (
    <StyledBody>
      <LinkedTabs tabs={newAppletTabs} />
    </StyledBody>
  );
};
