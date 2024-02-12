import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

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
import { PublishedApplet, auth, library, SingleApplet } from 'redux/modules';
import { Header, RightButtonType } from 'modules/Library/components';
import {
  useAppletsFromCart,
  useReturnToLibraryPath,
  useWorkspaceList,
} from 'modules/Library/hooks';
import { getDictionaryText, Mixpanel, Path } from 'shared/utils';

import { Applet, AppletUiType } from '../Applet';
import { AddToBuilderPopup, AuthPopup } from '../Popups';
import { StyledLink } from './Cart.styles';
import { StyledTablePagination } from '../AppletsCatalog/AppletsCatalog.styles';
import { DEFAULT_APPLETS_PER_PAGE, DEFAULT_PAGE } from '../AppletsCatalog/AppletsCatalog.conts';
import { getSearchIncludes, getAddToBuilderData, navigateToBuilder } from './Cart.utils';
import { useClearCart } from './Cart.hooks';

export const Cart = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const isAuthorized = auth.useAuthorized();
  const { result: cartItems } = library.useCartApplets() || {};
  const loadingStatus = library.useCartAppletsStatus();
  const isAddToBuilderBtnDisabled = library.useIsAddToBuilderBtnDisabled() || !cartItems?.length;
  const [searchValue, setSearchValue] = useState('');
  const [addToBuilderPopupVisible, setAddToBuilderPopupVisible] = useState(false);
  const [authPopupVisible, setAuthPopupVisible] = useState(false);
  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGE);
  const { workspaces } = useWorkspaceList(isAuthorized);
  const handleClearCart = useClearCart();
  const dataTestid = 'library-cart';

  const handleAddToBuilder = async () => {
    Mixpanel.track('Add to applet builder click');
    if (!isAuthorized) {
      return setAuthPopupVisible(true);
    }

    if (
      // if only one workspace without applets
      workspaces?.length === 1 &&
      Object.keys(workspaces[0].workspaceRoles).length === 0
    ) {
      const { appletToBuilder } = await getAddToBuilderData(cartItems);

      navigateToBuilder(navigate, Path.NewApplet, appletToBuilder as SingleApplet);
      handleClearCart();

      return;
    }

    return setAddToBuilderPopupVisible(true);
  };

  const handleSearch = (searchText: string) => {
    setSearchValue(searchText);
    setPageIndex(DEFAULT_PAGE);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPageIndex(newPage + 1);
  };

  useAppletsFromCart();
  useReturnToLibraryPath(page.libraryCart);

  const filteredApplets =
    cartItems?.reduce((renderedApplets: PublishedApplet[], applet) => {
      const { displayName, description, activities, keywords } = applet;
      const appletNameSearch = getSearchIncludes(displayName, searchValue);
      const appletDescriptionSearch =
        description && getSearchIncludes(getDictionaryText(description), searchValue);
      const activitySearch = activities.some((activity) => {
        const itemsSearch = activity.items.some(
          (item) =>
            item?.question && getSearchIncludes(getDictionaryText(item.question), searchValue),
        );

        return getSearchIncludes(activity.name, searchValue) || itemsSearch;
      });
      const keywordsSearch = keywords.some((keyword) => getSearchIncludes(keyword, searchValue));

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
    searchValue ? (
      <EmptyState>{t('notFound')}</EmptyState>
    ) : (
      <EmptyState icon="empty-cart">
        <>
          {t('emptyCart')}
          <StyledLink to={page.library} data-testid="library-cart-go-to-library">
            {t('appletsCatalog')}
          </StyledLink>
          .
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
          isRightButtonDisabled={isAddToBuilderBtnDisabled}
        />
        <ContentContainer>
          <StyledHeadlineLarge sx={{ marginBottom: theme.spacing(3.6) }}>
            {t('cart')}
          </StyledHeadlineLarge>
          <StyledAppletList>
            {pagedApplets?.length
              ? pagedApplets.map((applet, index) => (
                  <StyledAppletContainer key={applet.id}>
                    <Applet
                      uiType={AppletUiType.Cart}
                      applet={applet}
                      search={searchValue}
                      setSearch={setSearchValue}
                      data-testid={`${dataTestid}-applet-${index}`}
                    />
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
              data-testid={`${dataTestid}-pagination`}
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
