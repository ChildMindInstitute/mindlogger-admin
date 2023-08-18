import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useBreadcrumbs } from 'shared/hooks';
import { EmptyState, Spinner } from 'shared/components';
import {
  theme,
  StyledBody,
  StyledHeadlineLarge,
  ContentContainer,
  StyledAppletContainer,
  StyledAppletList,
} from 'shared/styles';
import { page } from 'resources';
import { PublishedApplet, auth, library } from 'redux/modules';
import { Header, RightButtonType } from 'modules/Library/components';
import { useAppletsFromCart, useReturnToLibraryPath } from 'modules/Library/hooks';
import { getDictionaryText, Mixpanel } from 'shared/utils';

import { Applet, AppletUiType } from '../Applet';
import { AddToBuilderPopup, AuthPopup } from '../Popups';
import { StyledLink } from './Cart.styles';
import { StyledTablePagination } from '../AppletsCatalog/AppletsCatalog.styles';
import { DEFAULT_APPLETS_PER_PAGE, DEFAULT_PAGE } from '../AppletsCatalog/AppletsCatalog.conts';
import { getSearchIncludes } from './Cart.utils';

export const Cart = () => {
  const { t } = useTranslation('app');
  const isAuthorized = auth.useAuthorized();
  const { result: cartItems } = library.useCartApplets() || {};
  const loadingStatus = library.useCartAppletsStatus();
  const isAddBtnDisabled = library.useIsCartBtnDisabled() || !cartItems?.length;
  const [searchValue, setSearchValue] = useState('');
  const [search, setSearch] = useState('');
  const [addToBuilderPopupVisible, setAddToBuilderPopupVisible] = useState(false);
  const [authPopupVisible, setAuthPopupVisible] = useState(false);
  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGE);

  const handleAddToBuilder = () => {
    isAuthorized ? setAddToBuilderPopupVisible(true) : setAuthPopupVisible(true);
    Mixpanel.track('Add to applet builder click');
  };

  const handleSearch = (searchText: string) => {
    setSearch(searchText);
    setPageIndex(DEFAULT_PAGE);
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPageIndex(newPage + 1);
  };

  useAppletsFromCart();
  useBreadcrumbs([
    {
      icon: 'cart-outlined',
      label: t('cart'),
    },
  ]);
  useReturnToLibraryPath(page.libraryCart);

  const filteredApplets =
    cartItems?.reduce((renderedApplets: PublishedApplet[], applet) => {
      const { displayName, description, activities, keywords } = applet;
      const appletNameSearch = getSearchIncludes(displayName, search);
      const appletDescriptionSearch =
        description && getSearchIncludes(getDictionaryText(description), search);
      const activitySearch = activities.some((activity) => {
        const itemsSearch = activity.items.some(
          (item) => item?.question && getSearchIncludes(getDictionaryText(item.question), search),
        );

        return getSearchIncludes(activity.name, search) || itemsSearch;
      });
      const keywordsSearch = keywords.some((keyword) => getSearchIncludes(keyword, search));

      if (appletNameSearch || appletDescriptionSearch || keywordsSearch || activitySearch) {
        renderedApplets.push(applet);
      }

      return renderedApplets;
    }, []) || [];
  const pagedApplets = filteredApplets.slice(
    (pageIndex - 1) * DEFAULT_APPLETS_PER_PAGE,
    pageIndex * DEFAULT_APPLETS_PER_PAGE,
  );

  const renderEmptyState = () =>
    search ? (
      <EmptyState>{t('notFound')}</EmptyState>
    ) : (
      <EmptyState icon="empty-cart">
        <>
          {t('emptyCart')} <StyledLink to={page.library}>{t('appletsCatalog')}</StyledLink>.
        </>
      </EmptyState>
    );

  return (
    <>
      <StyledBody sx={{ position: 'relative' }}>
        {loadingStatus === 'loading' && <Spinner />}
        <Header
          handleSearch={handleSearch}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          isBackButtonVisible
          rightButtonType={RightButtonType.Builder}
          rightButtonCallback={handleAddToBuilder}
          isRightButtonDisabled={isAddBtnDisabled}
        />
        <ContentContainer>
          <StyledHeadlineLarge sx={{ marginBottom: theme.spacing(3.6) }}>
            {t('cart')}
          </StyledHeadlineLarge>
          <StyledAppletList>
            {pagedApplets?.length
              ? pagedApplets.map((applet) => (
                  <StyledAppletContainer key={applet.id}>
                    <Applet uiType={AppletUiType.Cart} applet={applet} setSearch={setSearchValue} />
                  </StyledAppletContainer>
                ))
              : renderEmptyState()}
          </StyledAppletList>
          {!!filteredApplets?.length && (
            <StyledTablePagination
              component="div"
              count={filteredApplets?.length || 0}
              rowsPerPage={DEFAULT_APPLETS_PER_PAGE}
              page={pageIndex - 1}
              onPageChange={handleChangePage}
              labelRowsPerPage=""
              rowsPerPageOptions={[]}
            />
          )}
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
