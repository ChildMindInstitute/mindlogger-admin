import { useNavigate, useParams } from 'react-router-dom';

import { library } from 'modules/Library/state';
import { useBreadcrumbs } from 'shared/hooks';
import { StyledBody, ContentContainer } from 'shared/styles/styledComponents';
import { page } from 'resources';

import { Applet, AppletUiType } from '../Applet';
import { Header, RightButtonType } from '../../components';

export const AppletDetails = () => {
  const navigate = useNavigate();
  const { appletId } = useParams();
  const applet = appletId ? library.usePublishedApplet(appletId) : undefined;

  useBreadcrumbs();

  return (
    <StyledBody>
      <Header
        isBackButtonVisible
        rightButtonType={RightButtonType.Cart}
        rightButtonCallback={() => navigate(page.libraryCart)}
      />
      <ContentContainer>
        {!!applet && <Applet uiType={AppletUiType.Details} applet={applet} />}
      </ContentContainer>
    </StyledBody>
  );
};
