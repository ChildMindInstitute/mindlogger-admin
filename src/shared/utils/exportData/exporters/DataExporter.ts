import { AxiosResponse } from 'axios';
import { DateTime, Interval } from 'luxon';

import { DEFAULT_ROWS_PER_PAGE } from 'modules/Dashboard/api/api.const';
import { Response } from 'shared/api';
import { exportTemplate } from 'shared/utils/exportTemplate';

export type DataExporterOptions = {
  appletId: string;
  fromDate?: string;
  toDate?: string;
};

/**
 * A base helper class for generating CSV files from data. It contains common methods for fetching data from the
 * API, and generating the actual CSV file.
 */
export abstract class DataExporter<D, O extends DataExporterOptions = DataExporterOptions> {
  protected constructor(public fileNamePrefix: string) {}

  protected getExportPageAmount(total: number) {
    return Math.ceil(total / DEFAULT_ROWS_PER_PAGE);
  }

  async requestAllPagesConcurrently<T>(
    asyncRequest: (page: number) => Promise<AxiosResponse<Response<T>>>,
    concurrentLimit: number,
  ): Promise<T[]> {
    const results: T[] = [];

    const firstResponse = await asyncRequest(1);

    const data = firstResponse.data.result;
    results.push(...data);

    const totalPages = this.getExportPageAmount(firstResponse.data.count);

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
  ): AsyncGenerator<T[]> {
    const axiosResponse = await asyncRequest(1);

    const totalPages = this.getExportPageAmount(axiosResponse.data.count);
    yield axiosResponse.data.result;

    if (totalPages > 1) {
      for (let page = 2; page <= totalPages; page++) {
        const nextPageResponse = await asyncRequest(page);
        yield nextPageResponse.data.result;
      }
    }
  }

  /**
   * Generate a list of every date between two dates inclusive
   * @param startDate
   * @param endDate
   */
  daysBetweenInterval(startDate: DateTime, endDate: DateTime): string[] {
    if (!startDate.isValid || !endDate.isValid) {
      return [];
    }

    const startISODate = startDate.toISODate() as string;
    const endISODate = endDate.toISODate() as string;

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
