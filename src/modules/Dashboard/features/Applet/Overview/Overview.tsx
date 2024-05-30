import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { DashboardTable } from 'modules/Dashboard/components';
import { AddParticipantPopup } from 'modules/Dashboard/features/Applet/Popups';
import { QuickStats } from 'modules/Dashboard/features/Applet/Overview/QuickStats';
import { Spinner } from 'shared/components';
import { StyledFlexColumn, StyledTitleLarge } from 'shared/styles';
import { GetAppletSubmissionsResponse, getAppletSubmissionsApi } from 'api';
import { useAsync } from 'shared/hooks';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';

import { mapResponseToQuickStatProps, mapResponseToSubmissionsTableProps } from './Overview.utils';
import { StyledRoot } from './Overview.styles';

const limit = DEFAULT_ROWS_PER_PAGE;

export const Overview = () => {
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { appletId } = useParams();
  const { execute, isLoading, previousValue, value } = useAsync(getAppletSubmissionsApi);
  const { t } = useTranslation('app');
  const { data } = value ?? previousValue ?? {};
  const dashboardTableProps = useMemo(
    () => mapResponseToSubmissionsTableProps(data ?? ({} as GetAppletSubmissionsResponse)),
    [data],
  );
  const showContent = !isLoading || (isLoading && data);

  const handlePopupClose = (shouldRefetch = false) => {
    setAddPopupOpen(false);

    if (!!appletId && shouldRefetch) {
      execute({ appletId, limit });
    }
  };

  useEffect(() => {
    if (appletId) {
      execute({ appletId, page, limit });
    }
  }, [appletId, execute, page]);

  return (
    <StyledRoot>
      {isLoading && <Spinner />}

      {showContent && (
        <>
          <QuickStats
            {...mapResponseToQuickStatProps(data, {
              onPressAddParticipant: () => {
                setAddPopupOpen(true);
              },
            })}
          />

          <StyledFlexColumn sx={{ gap: 1.6 }}>
            <StyledTitleLarge>{t('appletOverview.titleRecentSubmissions')}</StyledTitleLarge>

            <DashboardTable
              {...dashboardTableProps}
              handleChangePage={(_, nextPage) => {
                // DashboardTable passes it's `handleChangePage` prop a 0-based
                // index value, but accepts its `page` prop as 1-based.
                setPage(nextPage + 1);
              }}
              page={page}
              rowsPerPage={limit}
            />
          </StyledFlexColumn>

          {appletId && addPopupOpen && (
            <AddParticipantPopup
              appletId={appletId}
              popupVisible={addPopupOpen}
              onClose={handlePopupClose}
            />
          )}
        </>
      )}
    </StyledRoot>
  );
};
