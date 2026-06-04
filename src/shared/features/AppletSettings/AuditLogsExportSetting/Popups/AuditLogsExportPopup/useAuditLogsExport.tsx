import { format } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { getExportAuditLogsApi } from 'api';
import { getExportPageAmount } from 'modules/Dashboard/api/api.utils';
import { DateRangePickerType } from 'shared/components/DateRangePicker';
import { DateFormats } from 'shared/consts';
import { getLast24hUTCRange } from 'shared/utils';

import { AuditLogsExportFormValues } from '../../AuditLogsExportSetting.types';
import { exportAuditLogsCsv } from './AuditLogsExportPopup.utils';

export const useAuditLogsExport = (
  appletId: string | undefined,
  appletName: string,
  handlePopupClose: () => void,
) => {
  const { getValues } = useFormContext<AuditLogsExportFormValues>();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const handlePopupCloseRef = useRef(handlePopupClose);
  handlePopupCloseRef.current = handlePopupClose;
  const isExportingRef = useRef(false);

  const fetchAuditLogs = useCallback(async () => {
    if (!appletId || isExportingRef.current) return;
    isExportingRef.current = true;

    setIsLoading(true);
    setError(null);
    setCurrentPage(0);
    setTotalPages(0);

    try {
      const { fromDate, toDate, dateType } = getValues();

      let formattedFromDate = format(fromDate, DateFormats.shortISO);
      let formattedToDate = format(toDate, DateFormats.shortISO);

      if (dateType === DateRangePickerType.Last24h) {
        ({ fromDate: formattedFromDate, toDate: formattedToDate } = getLast24hUTCRange());
      }

      const params = {
        appletId,
        fromDatetime: formattedFromDate,
        toDatetime: formattedToDate,
      };

      // Fetch the first page of audit logs and get the total number of pages
      const firstPageResponse = await getExportAuditLogsApi({ ...params, page: 1 });
      const { result: firstPageData, count: totalCount = 0 } = firstPageResponse.data;
      const pages = getExportPageAmount(totalCount);

      setTotalPages(pages);
      setCurrentPage(1);

      const fileName = `${appletName}-audit-logs-export`;

      // Export first page immediately
      await exportAuditLogsCsv(firstPageData, pages > 1 ? `${fileName}_page_1` : fileName);

      // Fetch and export remaining pages one at a time
      for (let page = 2; page <= pages; page++) {
        const nextPageResponse = await getExportAuditLogsApi({ ...params, page });
        await exportAuditLogsCsv(nextPageResponse.data.result, `${fileName}_page_${page}`);
        setCurrentPage(page);
      }

      handlePopupCloseRef.current();
    } catch (e) {
      setError(e as Error);
    } finally {
      isExportingRef.current = false;
      setIsLoading(false);
    }
  }, [appletId, appletName, getValues]);

  useEffect(() => {
    if (!appletId) return;

    fetchAuditLogs();
  }, [fetchAuditLogs]);

  return {
    isLoading,
    error,
    currentPage,
    totalPages,
    retry: fetchAuditLogs,
  };
};
