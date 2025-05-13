import { AxiosResponse } from 'axios';
import { DateTime, Interval } from 'luxon';

import { DEFAULT_ROWS_PER_PAGE } from 'modules/Dashboard/api/api.const';
import { Response } from 'shared/api';
import { exportTemplate } from 'shared/utils/exportTemplate';

export type DataExporterOptions = {
  /**
   * The ID of the applet to export data from
   */
  appletId: string;

  /**
   * Export data starting from this date, in the format yyyy-MM-ddTHH:mm:ss. When omitted, all data is exported
   */
  fromDate?: string;

  /**
   * Export data until this date, in the format yyyy-MM-ddTHH:mm:ss. When omitted, all data is exported
   */
  toDate?: string;
};

/**
 * A base helper class for generating CSV files from data. It contains common methods for fetching data from the
 * API, and generating the actual CSV file.
 */
export abstract class DataExporter<D, O extends DataExporterOptions = DataExporterOptions> {
  protected constructor(public fileNamePrefix: string) {}

  protected getExportPageAmount(total: number, limitPerPage = DEFAULT_ROWS_PER_PAGE): number {
    return Math.ceil(total / limitPerPage);
  }

  /**
   * A helper function for fetching all pages of a paginated response from the API
   * @param asyncRequest The API request that fetches a single page of data
   * @param concurrentLimit How many API requests to make concurrently
   * @param limitPerPage How many results to fetch per page. If you pass a different `limit` query parameter
   *                    to the API than `DEFAULT_ROWS_PER_PAGE`, you should pass it here
   */
  async requestAllPagesConcurrently<T>(
    asyncRequest: (page: number) => Promise<AxiosResponse<Response<T>>>,
    concurrentLimit: number,
    limitPerPage: number = DEFAULT_ROWS_PER_PAGE,
  ): Promise<T[]> {
    const results: T[] = [];

    const firstResponse = await asyncRequest(1);

    const data = firstResponse.data.result;
    results.push(...data);

    const totalPages = this.getExportPageAmount(firstResponse.data.count, limitPerPage);

    const promises: Array<Promise<AxiosResponse<Response<T>>>> = [];
    let page = 2;

    while (page <= totalPages) {
      const nextResponse = asyncRequest(page);
      promises.push(nextResponse);
      page++;

      if (promises.length >= concurrentLimit) {
        // Wait for one of the promises to resolve
        const [result, index] = await Promise.race(
          promises.map((p, i) => p.then((it): [AxiosResponse<Response<T>>, number] => [it, i])),
        );
        promises.splice(index, 1);
        results.push(...result.data.result);
      }
    }

    const rest = await Promise.all(promises);
    const dataFromRest = rest.map((it) => it.data.result).flatMap((it) => it);
    results.push(...dataFromRest);

    return results;
  }

  protected async *requestAllPages<T>(
    asyncRequest: (page: number) => Promise<AxiosResponse<Response<T>>>,
    limitPerPage: number = DEFAULT_ROWS_PER_PAGE,
  ): AsyncGenerator<T[]> {
    const axiosResponse = await asyncRequest(1);

    const totalPages = this.getExportPageAmount(axiosResponse.data.count, limitPerPage);
    yield axiosResponse.data.result;

    if (totalPages > 1) {
      for (let page = 2; page <= totalPages; page++) {
        const nextPageResponse = await asyncRequest(page);
        yield nextPageResponse.data.result;
      }
    }
  }

  /**
   * Check if a date is in the format YYYY-MM-DD
   */
  isISODate(date: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  }

  /**
   * Generate a list of every date between two dates inclusive. The data parameters must be valid dates in the format
   * YYYY-MM-DD
   * @param startISODate The start of the interval
   * @param endISODate The end of the interval
   */
  daysBetweenInterval(startISODate: string, endISODate: string): string[] {
    if (!this.isISODate(startISODate) || !this.isISODate(endISODate)) {
      // The dates are invalid, so return nothing
      return [];
    }

    const startDate = DateTime.fromISO(startISODate, { zone: 'UTC' });
    const endDate = DateTime.fromISO(endISODate, { zone: 'UTC' });

    if (!startDate.isValid || !endDate.isValid) {
      // The dates are invalid, so return nothing
      return [];
    }

    if (startISODate === endISODate) {
      return [startISODate];
    }

    const interval = Interval.fromDateTimes(startDate, endDate);

    const splitInterval = interval.splitBy({ day: 1 });
    const mappedInterval = splitInterval.map((d) => [d.start?.toISODate(), d.end?.toISODate()]);
    const flatMappedInterval = mappedInterval.flatMap((d) => d);
    const filteredInterval = flatMappedInterval.filter((d): d is string => d !== undefined);
    const dedupedInterval = [...new Set(filteredInterval)];

    return dedupedInterval;
  }

  abstract getCSVHeaders(): string[];

  abstract exportData(params: O): Promise<void>;

  async downloadAsCSV(data: D[]): Promise<void> {
    await exportTemplate({
      data,
      fileName: this.fileNamePrefix,
      defaultData: data.length > 0 ? null : this.getCSVHeaders(),
    });
  }
}
