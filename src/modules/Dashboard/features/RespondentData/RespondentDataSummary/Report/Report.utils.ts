import { Completion, GetCompletions } from './Report.types';

export const getCompletions = ({
  isFlow,
  flowSubmissions,
  answers,
}: GetCompletions): Completion[] =>
  isFlow
    ? flowSubmissions.map(({ submitId, endDatetime, createdAt }) => ({
        id: submitId,
        endDatetime: endDatetime ?? createdAt,
        areSubscalesVisible: false,
        isFlow,
        // TODO: add review count support for Flows
      }))
    : answers.map(({ answerId, endDatetime, subscaleSetting, reviewCount }) => ({
        id: answerId,
        endDatetime,
        areSubscalesVisible: !!subscaleSetting?.subscales?.length,
        reviewCount,
        isFlow,
      }));
