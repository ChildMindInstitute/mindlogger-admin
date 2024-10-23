import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import { page } from 'resources';
import { StyledBody, ContentContainer } from 'shared/styles';
import { useAsync } from 'shared/hooks/useAsync';
import { Spinner } from 'shared/components';
import { getPublishedAppletApi } from 'modules/Library/api';
import { Header, RightButtonType } from 'modules/Library/components';
import { useAppletsFromCart, useReturnToLibraryPath } from 'modules/Library/hooks';
import { library } from 'modules/Library/state';
import { Mixpanel, MixpanelEventType, MixpanelProps } from 'shared/utils/mixpanel';

import { Applet, AppletUiType } from '../Applet';

export const AppletDetails = () => {
  const navigate = useNavigate();
  const { appletId } = useParams();
  const location = useLocation();
  const { execute, value, isLoading } = useAsync(getPublishedAppletApi);
  const applet = value?.data?.result;
  const loadingCartStatus = library.useCartAppletsStatus();

  useAppletsFromCart();
  useReturnToLibraryPath(location.pathname);

  useEffect(() => {
    appletId && execute({ appletId });
  }, [appletId]);

  const handleNavigateToLibraryCart = () => {
    navigate(page.libraryCart);
    Mixpanel.track(MixpanelEventType.GoToBasketClick, {
      [MixpanelProps.AppletId]: appletId,
    });
  };

  return (
    <StyledBody sx={{ position: 'relative' }}>
      {(isLoading || loadingCartStatus === 'loading') && <Spinner />}
      <Header
        isBackButtonVisible
        rightButtonType={RightButtonType.Cart}
        rightButtonCallback={handleNavigateToLibraryCart}
      />
      <ContentContainer>
        {!!applet && (
          <Applet
            uiType={AppletUiType.Details}
            applet={applet}
            data-testid="library-applet-details"
          />
        )}
      </ContentContainer>
    </StyledBody>
  );
};
