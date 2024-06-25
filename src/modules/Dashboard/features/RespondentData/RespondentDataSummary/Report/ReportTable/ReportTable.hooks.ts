import { useMemo, useState } from 'react';
import { format } from 'date-fns';

import { DateFormats, DEFAULT_ROWS_PER_PAGE, ItemResponseType } from 'shared/consts';
import { Order } from 'shared/types';
import {
  TextAnswer,
  DateAnswer,
  TimeRangeAnswer,
} from 'modules/Dashboard/features/RespondentData/RespondentData.types';

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
  answers = [],
  searchValue,
  page,
  order,
  orderBy,
  skippedResponse,
}: UseResponseDataProps) => {
  const [count, setCount] = useState(answers.length);

  const visibleRows = useMemo(() => {
    if (!answers.length) {
      return [];
    }

    const currentPage = page - 1;
    let formattedAnswers: FormattedAnswers[];

    switch (responseType) {
      case ItemResponseType.Date:
      case ItemResponseType.Text: {
        const answerList = answers as (DateAnswer | TextAnswer)[];
        formattedAnswers = answerList.reduce(
          (textItemAnswers: TextItemAnswer[], { answer, date: answerDate }) => {
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

        setCount(formattedAnswers.length);

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
        const answerList = answers as TimeRangeAnswer[];
        formattedAnswers = answerList.reduce(
          (itemAnswers: TimeRangeItemAnswer[], { answer, date: answerDate }) => {
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

        setCount(formattedAnswers.length);

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
    count,
    visibleRows,
    columns,
  };
};
