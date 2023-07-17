import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import { page } from 'resources';
import { useBreadcrumbs } from 'shared/hooks';
import { StyledBody, ContentContainer } from 'shared/styles';
import { useAsync } from 'shared/hooks';
import { Spinner } from 'shared/components';
import { getPublishedAppletApi } from 'modules/Library/api';
import { Header, RightButtonType } from 'modules/Library/components';
import { useAppletsFromCart, useReturnToLibraryPath } from 'modules/Library/hooks';
import { library } from 'modules/Library/state';

import { Applet, AppletUiType } from '../Applet';

export const AppletDetails = () => {
  const navigate = useNavigate();
  const { appletId } = useParams();
  const location = useLocation();
  const { execute, value, isLoading } = useAsync(getPublishedAppletApi);
  const applet = value?.data?.result;
  const loadingCartStatus = library.useCartAppletsStatus();

  useBreadcrumbs();
  useAppletsFromCart();
  useReturnToLibraryPath(location.pathname);

  useEffect(() => {
    appletId && execute({ appletId });
  }, [appletId]);

  return (
    <StyledBody sx={{ position: 'relative' }}>
      {(isLoading || loadingCartStatus === 'loading') && <Spinner />}
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
