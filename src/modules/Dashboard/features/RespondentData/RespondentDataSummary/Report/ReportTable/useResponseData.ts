import { format } from 'date-fns';
import { useMemo } from 'react';

import { DateFormats, DEFAULT_ROWS_PER_PAGE, ItemResponseType } from 'shared/consts';
import { Order } from 'shared/types';

import { Answer, TimeRangeAnswerValue, SimpleAnswerValue } from '../Report.types';
import {
  FormattedAnswers,
  ReportTableProps,
  TextItemAnswer,
  TimeRangeItemAnswer,
} from './ReportTable.types';
import {
  filterReportTable,
  stableSort,
  getComparator,
  getSimpleTextRows,
} from './ReportTable.utils';
import { getSimpleItemHeadCells, getTimeRangeItemHeadCells } from './ReportTable.const';
import { getTimeRangeRows } from './ReportTable.utils';

type UseResponseDataProps = {
  responseType: ReportTableProps['responseType'];
  answers: ReportTableProps['answers'];
  searchValue: string;
  page: number;
  order: Order;
  orderBy: string;
  skippedResponse: JSX.Element;
};

export const useResponseData = ({
  responseType,
  answers,
  searchValue,
  page,
  order,
  orderBy,
  skippedResponse,
}: UseResponseDataProps) => {
  const visibleRows = useMemo(() => {
    const currentPage = page - 1;
    let formattedAnswers: FormattedAnswers[];

    switch (responseType) {
      case ItemResponseType.Date:
      case ItemResponseType.Text: {
        const answerList = (answers ?? []) as unknown as Answer<SimpleAnswerValue>[];
        formattedAnswers = answerList.reduce(
          (
            textItemAnswers: TextItemAnswer[],
            { answer, date: answerDate }: Answer<SimpleAnswerValue>,
          ) => {
            const date = format(new Date(answerDate), DateFormats.DayMonthYear);
            const time = format(new Date(answerDate), DateFormats.Time);

            if (
              !filterReportTable(`${date} ${time} ${answer.value}`, searchValue) ||
              answer.value === undefined
            ) {
              return textItemAnswers;
            }

            return [
              ...textItemAnswers,
              {
                date,
                time,
                answer: answer.value || '',
              },
            ];
          },
          [],
        );

        const visibleAnswers = stableSort(
          formattedAnswers as TextItemAnswer[],
          getComparator(order, orderBy),
        ).slice(
          currentPage * DEFAULT_ROWS_PER_PAGE,
          currentPage * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
        );

        return getSimpleTextRows(visibleAnswers, skippedResponse);
      }
      case ItemResponseType.TimeRange: {
        const answerList = (answers ?? []) as unknown as Answer<TimeRangeAnswerValue>[];
        formattedAnswers = answerList.reduce(
          (
            itemAnswers: TimeRangeItemAnswer[],
            { answer, date: answerDate }: Answer<TimeRangeAnswerValue>,
          ) => {
            const date = format(new Date(answerDate), DateFormats.DayMonthYear);
            const time = format(new Date(answerDate), DateFormats.Time);

            if (
              !filterReportTable(
                `${date} ${time} ${answer.value?.from} ${answer.value?.to}`,
                searchValue,
              ) ||
              answer.value === undefined
            ) {
              return itemAnswers;
            }

            return [
              ...itemAnswers,
              {
                date,
                time,
                from: answer.value?.from || '',
                to: answer.value?.to || '',
              },
            ];
          },
          [],
        );

        const visibleAnswers = stableSort(
          formattedAnswers as TimeRangeItemAnswer[],
          getComparator(order, orderBy),
        ).slice(
          currentPage * DEFAULT_ROWS_PER_PAGE,
          currentPage * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
        );

        return getTimeRangeRows(visibleAnswers, skippedResponse);
      }
      default:
        return [];
    }
  }, [responseType, answers, searchValue, page, order, orderBy, skippedResponse]);

  const columns = useMemo(() => {
    switch (responseType) {
      case ItemResponseType.Date:
      case ItemResponseType.Text: {
        return getSimpleItemHeadCells();
      }
      case ItemResponseType.TimeRange: {
        return getTimeRangeItemHeadCells();
      }
      default:
        return [];
    }
  }, [responseType]);

  return {
    visibleRows,
    columns,
  };
};
