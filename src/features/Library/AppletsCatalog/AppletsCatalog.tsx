import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useBreadcrumbs } from 'hooks';
import { useAppDispatch } from 'redux/store';
import { library } from 'redux/modules';
import { Header, RightButtonType } from 'features/Library/Header';
import { Applet } from 'features/Library/Applet';
import { page } from 'resources';
import { StyledBody, StyledHeadlineLarge } from 'styles/styledComponents';
import theme from 'styles/theme';

import {
  ContentContainer,
  StyledAppletList,
  StyledAppletContainer,
  StyledTablePagination,
} from './AppletsCatalog.styles';

export const DEFAULT_APPLETS_PER_PAGE = 6;

export const AppletsCatalog = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useBreadcrumbs();

  const publishedApplets = library.usePublishedApplets();

  const [pageIndex, setPageIndex] = useState(0);
  const [recordsPerPage, setRecordsPerPage] = useState(DEFAULT_APPLETS_PER_PAGE);
  const [searchText, setSearchText] = useState('');

  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
    setPageIndex(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPageIndex(newPage);
    dispatch(library.thunk.getPublishedApplets({ recordsPerPage, pageIndex: newPage, searchText }));
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRecordsPerPage(parseInt(event.target.value, 10));
    setPageIndex(0);
  };

  useEffect(() => {
    const timeout = setTimeout(
      () =>
        dispatch(library.thunk.getPublishedApplets({ recordsPerPage, pageIndex: 0, searchText })),
      1000,
      // TODO: discuss search - use hook or fix search by enter
    );

    return () => clearTimeout(timeout);
  }, [searchText]);

  return (
    <StyledBody>
      <Header
        handleSearch={handleSearch}
        rightButtonType={RightButtonType.Cart}
        rightButtonCallback={() => navigate(page.libraryCart)}
      />
      <ContentContainer>
        {publishedApplets?.data?.length && (
          <>
            <StyledHeadlineLarge sx={{ marginBottom: theme.spacing(3.6) }}>
              {t('appletsCatalog')}
            </StyledHeadlineLarge>
            <StyledAppletList>
              {publishedApplets?.data?.map((applet) => (
                <StyledAppletContainer key={applet.id}>
                  <Applet applet={applet} />
                </StyledAppletContainer>
              ))}
            </StyledAppletList>
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
          </>
        )}
      </ContentContainer>
    </StyledBody>
  );
};
