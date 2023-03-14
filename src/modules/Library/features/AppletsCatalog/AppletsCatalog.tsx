import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useBreadcrumbs } from 'shared/hooks';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { EmptyTable } from 'shared/components';
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
import { mockedPublishedAppletResponse } from './mocked';
import { PublishedAppletResponse } from './AppletsCatalog.types';

export const DEFAULT_APPLETS_PER_PAGE = 6;

export const AppletsCatalog = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useBreadcrumbs();

  // const publishedApplets = library.usePublishedApplets();
  const publishedApplets: PublishedAppletResponse = mockedPublishedAppletResponse;

  const [pageIndex, setPageIndex] = useState(0);
  const [recordsPerPage, setRecordsPerPage] = useState(DEFAULT_APPLETS_PER_PAGE);
  const [searchText, setSearchText] = useState('');

  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
    setPageIndex(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPageIndex(newPage);
    // TODO: delete comment when endpoint is ready
    // dispatch(library.thunk.getPublishedApplets({ recordsPerPage, pageIndex: newPage, searchText }));
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRecordsPerPage(parseInt(event.target.value, 10));
    setPageIndex(0);
  };

  const renderEmptyState = () => !!searchText && <EmptyTable>{t('notFound')}</EmptyTable>;

  useEffect(() => {
    // TODO: delete comment when endpoint is ready
    // const timeout = setTimeout(
    //   () =>
    //     dispatch(library.thunk.getPublishedApplets({ recordsPerPage, pageIndex: 0, searchText })),
    //   1000,
    //   // TODO: discuss search - use hook or fix search by enter
    // );
    // return () => clearTimeout(timeout);
  }, [searchText]);

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
            {publishedApplets?.data?.length
              ? publishedApplets.data
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
          {publishedApplets?.data?.length && (
            <StyledTablePagination
              component="div"
              count={publishedApplets?.totalCount || 0}
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
