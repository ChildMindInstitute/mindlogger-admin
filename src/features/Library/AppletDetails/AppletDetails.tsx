import { useNavigate } from 'react-router-dom';

import { useBreadcrumbs } from 'hooks';
import { StyledBody } from 'styles/styledComponents';
import { Header } from 'features/Library/Header';
import { RightButtonType } from 'features/Library/Header/Header.types';
import { Applet, AppletUiType } from 'features/Library/Applet';
import { page } from 'resources';

import { ContentContainer } from './AppletDetails.styles';
import { mockedApplet as applet } from './mocked';

export const AppletDetails = () => {
  const navigate = useNavigate();

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
