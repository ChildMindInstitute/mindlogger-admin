import { useNavigate, useParams } from 'react-router-dom';

import { PublishedApplet } from 'modules/Library/state';
import { useBreadcrumbs } from 'shared/hooks';
import { StyledBody, ContentContainer } from 'shared/styles/styledComponents';
import { page } from 'resources';

import { Applet, AppletUiType } from '../Applet';
import { Header, RightButtonType } from '../../components';
import { mockedPublishedAppletResponse } from '../AppletsCatalog/mocked';

export const AppletDetails = () => {
  const navigate = useNavigate();
  const { appletId: id } = useParams();

  // TODO: replace with real data when the endpoint is ready
  const applet = mockedPublishedAppletResponse.data.find(
    ({ appletId }) => appletId === id,
  ) as PublishedApplet;

  useBreadcrumbs();

  return (
    <StyledBody>
      <Header
        isBackButtonVisible
        rightButtonType={RightButtonType.Cart}
        rightButtonCallback={() => navigate(page.libraryCart)}
      />
      <ContentContainer>
        <Applet uiType={AppletUiType.Details} applet={applet} />
      </ContentContainer>
    </StyledBody>
  );
};
