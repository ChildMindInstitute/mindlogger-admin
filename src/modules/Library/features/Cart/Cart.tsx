import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useBreadcrumbs } from 'shared/hooks';
import { EmptyState } from 'shared/components';
import {
  theme,
  StyledBody,
  StyledHeadlineLarge,
  ContentContainer,
  StyledAppletContainer,
  StyledAppletList,
} from 'shared/styles';
import { page } from 'resources';
import { auth, PublishedApplet } from 'redux/modules';

import { Header, RightButtonType } from '../../components';
import { Applet, AppletUiType } from '../Applet';
import { StyledLink } from './Cart.styles';
import { AddToBuilderPopup, AuthPopup } from '../Popups';

export const Cart = () => {
  const { t } = useTranslation('app');
  const isAuthorized = auth.useAuthorized();
  const [searchValue, setSearchValue] = useState('');
  const [addToBuilderPopupVisible, setAddToBuilderPopupVisible] = useState(false);
  const [authPopupVisible, setAuthPopupVisible] = useState(false);

  // TODO: replace with real data
  const applets: PublishedApplet[] = [];

  useBreadcrumbs([
    {
      icon: 'cart-outlined',
      label: t('cart'),
    },
  ]);

  const renderEmptyState = () =>
    searchValue ? (
      <EmptyState>{t('notFound')}</EmptyState>
    ) : (
      <EmptyState icon="empty-cart">
        <>
          {t('emptyCart')} <StyledLink to={page.library}>{t('appletsCatalog')}</StyledLink>.
        </>
      </EmptyState>
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
