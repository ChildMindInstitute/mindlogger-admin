import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from 'redux/store';
import { library } from 'redux/modules';
import { page } from 'resources';
import { EmptyState, Spinner } from 'shared/components';
import {
  theme,
  StyledBody,
  StyledHeadlineLarge,
  ContentContainer,
  StyledAppletContainer,
  StyledAppletList,
} from 'shared/styles';
import { Mixpanel, MixpanelEventType } from 'shared/utils/mixpanel';
import { Header, RightButtonType } from 'modules/Library/components';
import { useAppletsFromCart, useReturnToLibraryPath } from 'modules/Library/hooks';

import { Applet } from '../Applet';
import { StyledTablePagination } from './AppletsCatalog.styles';
import { DEFAULT_PAGE, DEFAULT_APPLETS_PER_PAGE } from './AppletsCatalog.conts';

export const AppletsCatalog = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useAppletsFromCart();
  useReturnToLibraryPath(page.library);

  const { count, result: appletsArray } = library.usePublishedApplets() || {};
  const loadingStatus = library.usePublishedAppletsStatus();
  const loadingCartStatus = library.useCartAppletsStatus();

  const isLoading = loadingStatus === 'loading' || loadingCartStatus === 'loading';

  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGE);
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (searchText: string) => {
    setPageIndex(DEFAULT_PAGE);

    dispatch(
      library.thunk.getPublishedApplets({
        page: DEFAULT_PAGE,
        search: searchText,
        limit: DEFAULT_APPLETS_PER_PAGE,
      }),
    ).finally(() => {
      setSearchValue(searchText);
    });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPageIndex(newPage + 1);
  };

  const renderEmptyState = () => !!searchValue && <EmptyState>{t('notFound')}</EmptyState>;

  const handleNavigateToLibraryCart = () => {
    navigate(page.libraryCart);
    Mixpanel.track(MixpanelEventType.GoToBasketClick);
  };

  useEffect(() => {
    dispatch(
      library.thunk.getPublishedApplets({
        page: pageIndex,
        search: searchValue,
        limit: DEFAULT_APPLETS_PER_PAGE,
      }),
    );
  }, [pageIndex]);

  return (
    <StyledBody sx={{ position: 'relative' }} data-testid="applets-catalog">
      {isLoading && <Spinner />}
      <Header
        handleSearch={handleSearch}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        rightButtonType={RightButtonType.Cart}
        rightButtonCallback={handleNavigateToLibraryCart}
      />
      <ContentContainer>
        <>
          <StyledHeadlineLarge sx={{ marginBottom: theme.spacing(3.6) }}>
            {t('appletsCatalog')}
          </StyledHeadlineLarge>
          <StyledAppletList data-testid="applets-catalog-applet-list">
            {appletsArray?.length
              ? appletsArray.map((applet, index) => (
                  <StyledAppletContainer key={applet.id}>
                    <Applet
                      applet={applet}
                      search={searchValue}
                      setSearch={handleSearch}
                      data-testid={`library-applets-${index}`}
                    />
                  </StyledAppletContainer>
                ))
              : renderEmptyState()}
          </StyledAppletList>
          {!!appletsArray?.length && (
            <StyledTablePagination
              component="div"
              count={count || 0}
              rowsPerPage={DEFAULT_APPLETS_PER_PAGE}
              page={pageIndex - 1}
              onPageChange={handleChangePage}
              labelRowsPerPage=""
              rowsPerPageOptions={[]}
              data-testid="library-applets-pagination"
            />
          )}
        </>
      </ContentContainer>
    </StyledBody>
  );
};
