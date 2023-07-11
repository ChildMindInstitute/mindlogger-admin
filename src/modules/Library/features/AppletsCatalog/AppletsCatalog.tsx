import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useBreadcrumbs } from 'shared/hooks';
import { useAppDispatch } from 'redux/store';
import { library } from 'redux/modules';
import { page } from 'resources';
import { EmptyState } from 'shared/components';
import {
  theme,
  StyledBody,
  StyledHeadlineLarge,
  ContentContainer,
  StyledAppletContainer,
  StyledAppletList,
} from 'shared/styles';
import { Header, RightButtonType } from 'modules/Library/components';

import { Applet } from '../Applet';
import { StyledTablePagination } from './AppletsCatalog.styles';
import { DEFAULT_PAGE, DEFAULT_APPLETS_PER_PAGE } from './AppletsCatalog.conts';

export const AppletsCatalog = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useBreadcrumbs();

  const { count, result: appletsArray } = library.usePublishedApplets() || {};

  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGE);
  const [search, setSearch] = useState('');

  const handleSearch = (searchText: string) => {
    setSearch(searchText);
    setPageIndex(DEFAULT_PAGE);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPageIndex(newPage + 1);
  };

  const renderEmptyState = () => !!search && <EmptyState>{t('notFound')}</EmptyState>;

  useEffect(() => {
    dispatch(
      library.thunk.getPublishedApplets({
        page: pageIndex,
        search,
        limit: DEFAULT_APPLETS_PER_PAGE,
      }),
    );
  }, [pageIndex, search]);

  return (
    <StyledBody>
      <Header
        handleSearch={handleSearch}
        rightButtonType={RightButtonType.Cart}
        rightButtonCallback={() => navigate(page.libraryCart)}
      />
      <ContentContainer>
        <>
          <StyledHeadlineLarge sx={{ marginBottom: theme.spacing(3.6) }}>
            {t('appletsCatalog')}
          </StyledHeadlineLarge>
          <StyledAppletList>
            {appletsArray?.length
              ? appletsArray.map((applet) => (
                  <StyledAppletContainer key={applet.id}>
                    <Applet applet={applet} />
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
            />
          )}
        </>
      </ContentContainer>
    </StyledBody>
  );
};
