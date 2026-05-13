import { getExportAuditLogsApi } from 'api';
import { format } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { getExportPageAmount } from 'modules/Dashboard/api/api.utils';
import { DateFormats } from 'shared/consts';
import { AuditEvent } from 'shared/types/auditEvent';

import { AuditLogsExportFormValues } from '../../AuditLogsExportSetting.types';

export const useAuditLogsExport = (appletId: string | undefined) => {
    const { getValues } = useFormContext<AuditLogsExportFormValues>();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [allAuditEvents, setAllAuditEvents] = useState<AuditEvent[] | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchAuditLogs = useCallback(async () => {
        if (!appletId) return;

        // Cancel any in-flight export before starting a new one.
        abortControllerRef.current?.abort();
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        setIsLoading(true);
        setError(null);
        setAllAuditEvents(null);
        setCurrentPage(0);
        setTotalPages(0);

        try {
            const { fromDate, toDate } = getValues();
            const params = {
                appletId,
                fromDate: format(fromDate, DateFormats.shortISO),
                toDate: format(toDate, DateFormats.shortISO),
            };

            // Fetch the first page of audit logs and get the total number of pages
            const firstPageResponse = await getExportAuditLogsApi(
                { ...params, page: 1 },
                abortController.signal,
            );
            const { result: firstPageData, count: totalCount = 0 } = firstPageResponse.data;
            const pages = getExportPageAmount(totalCount);

            setTotalPages(pages);
            setCurrentPage(1);

            const accumulatedEvents = [...firstPageData.auditEvents];

            // Fetch the remaining pages of audit logs and accumulate the audit events
            for (let page = 2; page <= pages; page++) {
                if (abortController.signal.aborted) return;

                const nextPageResponse = await getExportAuditLogsApi(
                    { ...params, page },
                    abortController.signal,
                );
                accumulatedEvents.push(...nextPageResponse.data.result.auditEvents);
                setCurrentPage(page);
            }

            setAllAuditEvents(accumulatedEvents);
        } catch (e) {
            if ((e as Error).name !== 'AbortError') {
                setError(e as Error);
            }
        } finally {
            setIsLoading(false);
        }
    }, [appletId, getValues]);

    useEffect(() => {
        if (!appletId) return;

        fetchAuditLogs();

        return () => {
            // Cancel the in-flight export when the component unmounts.
            abortControllerRef.current?.abort();
        };
    }, [fetchAuditLogs]);

    return {
        isLoading,
        error,
        allAuditEvents,
        currentPage,
        totalPages,
        retry: fetchAuditLogs,
    };
};
