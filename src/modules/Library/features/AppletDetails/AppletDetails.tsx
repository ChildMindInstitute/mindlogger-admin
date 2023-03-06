import { useNavigate, useParams } from 'react-router-dom';

import { PublishedApplet } from 'redux/modules';
import { useBreadcrumbs } from 'hooks';
import { StyledBody, ContentContainer } from 'styles/styledComponents';
import { page } from 'resources';

import { Applet, AppletUiType } from '../Applet';
import { mockedApplets } from '../AppletsCatalog/mocked';
import { Header, RightButtonType } from '../../components';

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
