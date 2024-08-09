import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { format } from 'date-fns';

import { ExportDataFormValues } from 'shared/features/AppletSettings/ExportDataSetting/ExportDataSetting.types';
import { DateFormats } from 'shared/consts';
import { getExportDataApi } from 'modules/Dashboard/api';
import { getExportPageAmount } from 'modules/Dashboard/api/api.utils';
import { ExportDataResult } from 'shared/types/answer';
import { sendLogFile } from 'shared/utils';

import { ExecuteAllPagesOfExportData, Modals } from '../DataExportPopup.types';
import { getFormattedToDate } from '../DataExportPopup.utils';

export class ExportDataFetchService {
  private abortController: AbortController | null = null;

  constructor(
    private setExportDataQueue: Dispatch<SetStateAction<ExportDataResult[] | null>>,
    private setActiveModal: Dispatch<SetStateAction<Modals>>,
    private dataExportingApiRef: MutableRefObject<boolean>,
    private limitRef: MutableRefObject<number>,
    private setDataIsExporting: Dispatch<SetStateAction<boolean>>,
  ) {}

  public executeAllPagesOfExportData = async (
    getValues: () => ExportDataFormValues,
    { appletId, targetSubjectIds }: ExecuteAllPagesOfExportData,
  ) => {
    this.abortController = new AbortController();
    try {
      this.dataExportingApiRef.current = true;
      this.setDataIsExporting(true);

      const dateType = getValues?.().dateType;
      const formFromDate = getValues?.().fromDate;
      const fromDate = formFromDate && format(formFromDate, DateFormats.shortISO);
      const formToDate = getValues?.().toDate;
      const toDate = getFormattedToDate({ dateType, formToDate });

      const body = {
        appletId,
        targetSubjectIds,
        fromDate,
        toDate,
      };
      const firstPageResponse = await getExportDataApi(body, this.abortController.signal);
      const { result: firstPageData, count = 0 } = firstPageResponse.data;
      const pageLimit = getExportPageAmount(count);
      this.setExportDataQueue([firstPageData]);

      if (pageLimit > 1) {
        this.limitRef.current = pageLimit;
        for (let page = 2; page <= pageLimit; page++) {
          const nextPageResponse = await getExportDataApi(
            {
              ...body,
              page,
            },
            this.abortController.signal,
          );
          const { result: nextPageData } = nextPageResponse.data;

          this.setExportDataQueue((prevState) =>
            prevState ? [...prevState, nextPageData] : [nextPageData],
          );
        }
      }
    } catch (e) {
      const error = e as TypeError;
      console.warn('Error while downloading export data', error);
      this.setActiveModal(Modals.ExportError);
      await sendLogFile({ error });
    } finally {
      this.dataExportingApiRef.current = false;
    }
  };

  public cancelExport = () => {
    if (this.abortController) {
      this.abortController.abort();
    }
  };
}
