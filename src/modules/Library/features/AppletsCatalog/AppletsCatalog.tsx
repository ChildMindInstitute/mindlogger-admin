import { ChangeEvent, useEffect, useState } from 'react';
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

import { Header, RightButtonType } from '../../components';
import { Applet } from '../Applet';
import { StyledTablePagination } from './AppletsCatalog.styles';

export const DEFAULT_APPLETS_PER_PAGE = 6;

export const AppletsCatalog = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useBreadcrumbs();

  const publishedApplets = library.usePublishedApplets();

  const [pageIndex, setPageIndex] = useState(0);
  const [recordsPerPage, setRecordsPerPage] = useState(DEFAULT_APPLETS_PER_PAGE);
  const [search, setSearch] = useState('');

  const handleSearch = (searchText: string) => {
    setSearch(searchText);
    setPageIndex(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPageIndex(newPage);
    dispatch(library.thunk.getPublishedApplets({ pageIndex: newPage, search }));
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRecordsPerPage(parseInt(event.target.value, 10));
    setPageIndex(0);
  };

  const renderEmptyState = () => !!search && <EmptyState>{t('notFound')}</EmptyState>;

  useEffect(() => {
    dispatch(library.thunk.getPublishedApplets({ pageIndex, search }));
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
            {publishedApplets?.result?.length
              ? publishedApplets.result
                  // TODO: delete slice when endpoint is ready
                  ?.slice(
                    pageIndex * DEFAULT_APPLETS_PER_PAGE,
                    pageIndex * DEFAULT_APPLETS_PER_PAGE + DEFAULT_APPLETS_PER_PAGE,
                  )
                  .map((applet) => (
                    <StyledAppletContainer key={applet.id}>
                      <Applet applet={applet} />
                    </StyledAppletContainer>
                  ))
              : renderEmptyState()}
          </StyledAppletList>
          {publishedApplets?.result?.length && (
            <StyledTablePagination
              component="div"
              count={publishedApplets?.count || 0}
              rowsPerPage={recordsPerPage}
              page={pageIndex}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage=""
              rowsPerPageOptions={[]}
            />
          )}
        </>
      </ContentContainer>
    </StyledBody>
  );
};
