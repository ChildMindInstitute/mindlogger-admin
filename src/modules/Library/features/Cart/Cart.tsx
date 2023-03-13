import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useBreadcrumbs } from 'shared/hooks';
import { EmptyTable, Svg, AddToBuilderPopup } from 'shared/components';
import {
  StyledBody,
  StyledHeadlineLarge,
  ContentContainer,
  StyledAppletContainer,
  StyledAppletList,
} from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { page } from 'resources';
import { auth, PublishedApplet } from 'redux/modules';

import { Header, RightButtonType } from '../../components';
import { Applet, AppletUiType } from '../Applet';
import { StyledLink } from './Cart.styles';
import { mockedCart } from './mocked';
import { AuthPopup } from '../Popups/AuthPopup';

export const Cart = () => {
  const { t } = useTranslation('app');
  const isAuthorized = auth.useAuthorized();
  const [searchValue, setSearchValue] = useState('');
  const [addToBuilderPopupVisible, setAddToBuilderPopupVisible] = useState(false);
  const [authPopupVisible, setAuthPopupVisible] = useState(false);

  // TODO: replace with real data
  const applets: PublishedApplet[] = mockedCart;

  useBreadcrumbs([
    {
      icon: <Svg id="cart-outlined" width="18" height="18" />,
      label: t('cart'),
    },
  ]);

  const renderEmptyState = () =>
    searchValue ? (
      <EmptyTable>{t('notFound')}</EmptyTable>
    ) : (
      <EmptyTable icon="empty-cart">
        <>
          {t('emptyCart')} <StyledLink to={page.library}>{t('appletsCatalog')}</StyledLink>.
        </>
      </EmptyTable>
    );

  const handleAddToBuilder = () =>
    isAuthorized ? setAddToBuilderPopupVisible(true) : setAuthPopupVisible(true);

  return (
    <>
      <StyledBody>
        <Header
          isBackButtonVisible
          handleSearch={(value) => setSearchValue(value)}
          rightButtonType={RightButtonType.Builder}
          rightButtonCallback={handleAddToBuilder}
        />
        <ContentContainer>
          <StyledHeadlineLarge sx={{ marginBottom: theme.spacing(3.6) }}>
            {t('cart')}
          </StyledHeadlineLarge>
          <StyledAppletList>
            {applets?.length
              ? applets.map((applet) => (
                  <StyledAppletContainer key={applet.id}>
                    <Applet uiType={AppletUiType.Cart} applet={applet} />
                  </StyledAppletContainer>
                ))
              : renderEmptyState()}
          </StyledAppletList>
        </ContentContainer>
      </StyledBody>
      {authPopupVisible && (
        <AuthPopup authPopupVisible={authPopupVisible} setAuthPopupVisible={setAuthPopupVisible} />
      )}
      {addToBuilderPopupVisible && (
        <AddToBuilderPopup
          addToBuilderPopupVisible={addToBuilderPopupVisible}
          setAddToBuilderPopupVisible={setAddToBuilderPopupVisible}
        />
      )}
    </>
  );
};
