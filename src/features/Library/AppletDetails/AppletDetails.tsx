import { useNavigate, useParams } from 'react-router-dom';

import { PublishedApplet } from 'redux/modules';
import { useBreadcrumbs } from 'hooks';
import { StyledBody, ContentContainer } from 'styles/styledComponents';
import { Header } from 'features/Library/Header';
import { RightButtonType } from 'features/Library/Header/Header.types';
import { Applet, AppletUiType } from 'features/Library/Applet';
import { page } from 'resources';
import { mockedApplets } from 'features/Library/AppletsCatalog/mocked';

export const AppletDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // TODO: replace with real data when the endpoint is ready
  const applet = mockedApplets.data.find(({ appletId }) => appletId === id) as PublishedApplet;

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
