import { FormattedResponses } from '../../RespondentData.types';

export const getLatestReportUrl = (base64Str: string) => `data:application/pdf;base64,${base64Str}`;

export const sortResponseOptions = (responseOptions: Record<string, FormattedResponses[]>) =>
  Object.fromEntries(
    Object.entries(responseOptions).sort(([keyA, valueA], [keyB, valueB]) => {
      const orderA = valueA[0].activityItem.order;
      const orderB = valueB[0].activityItem.order;

      return orderA - orderB || keyA.localeCompare(keyB);
    }),
  );
