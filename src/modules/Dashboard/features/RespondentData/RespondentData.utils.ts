import { format } from 'date-fns';

import { AutocompleteOption } from 'shared/components/FormComponents';
import { DateFormats } from 'shared/consts';
import { DecryptedDateAnswer, ElementType, DecryptedDateRangeAnswer } from 'shared/types';
import { createArray, getNormalizeTimezoneData } from 'shared/utils';
import { ActivitySettingsSubscale } from 'shared/state/Applet';

import { ActivityCompletion, FormattedResponse, Identifier } from './RespondentData.types';
import {
  compareActivityItem,
  formatActivityItemAnswers,
} from './RespondentDataSummary/Report/Report.utils';

export const createArrayForSlider = ({
  maxValue,
  minValue,
}: {
  maxValue: number;
  minValue: number;
}) =>
  createArray(maxValue - minValue + 1, (index) => ({
    value: minValue + index,
    label: minValue + index,
  }));

export const getUniqueIdentifierOptions = (identifiers: Identifier[]) => {
  const uniqueIdentifiersSet = new Set<string>();

  return identifiers.reduce((uniqueIdentifiers: AutocompleteOption[], identifierItem) => {
    if (!identifierItem) return uniqueIdentifiers;

    const { decryptedValue } = identifierItem;

    if (!uniqueIdentifiersSet.has(decryptedValue)) {
      uniqueIdentifiersSet.add(decryptedValue);

      return [
        ...uniqueIdentifiers,
        {
          label: decryptedValue,
          id: decryptedValue,
        },
      ];
    }

    return uniqueIdentifiers;
  }, []);
};

export const getDateFormattedResponse = (answer: DecryptedDateAnswer) => {
  if (!answer?.value) return '';

  const { day, month, year } = answer.value;
  const monthIndex = month - 1;
  const answerValue = new Date(year, monthIndex, day).toDateString();

  return format(new Date(getNormalizeTimezoneData(answerValue).dateTime), DateFormats.DayMonthYear);
};

export const getDateISO = (date: Date, time: string) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const [hours, minutes] = time.split(':');

  const utcDate = Date.UTC(year, month, day, +hours, +minutes);

  return new Date(utcDate).toISOString().split('.')[0];
};

export const getIdentifiers = (
  filterByIdentifier = false,
  filterIdentifiers = [] as AutocompleteOption[],
  identifiers = [] as Identifier[],
): string[] | undefined => {
  if (!filterByIdentifier) return;

  return identifiers.reduce(
    (decryptedIdentifiers: string[], { encryptedValue, decryptedValue }: Identifier) => {
      const identifier = filterIdentifiers.find(
        (filterIdentifier) => filterIdentifier.id === decryptedValue,
      );

      return identifier ? [...decryptedIdentifiers, encryptedValue] : decryptedIdentifiers;
    },
    [],
  );
};

export const getFormattedResponses = (activityResponses: ActivityCompletion[]) => {
  let subscalesFrequency = 0;
  const formattedResponses = activityResponses.reduce(
    (
      items: Record<string, FormattedResponse[]>,
      { decryptedAnswer, endDatetime, subscaleSetting }: ActivityCompletion,
    ) => {
      if (subscaleSetting?.subscales?.length) {
        subscalesFrequency++;
      }
      const subscalesItems = subscaleSetting?.subscales?.reduce(
        (items: string[], subscale: ActivitySettingsSubscale) => {
          subscale?.items?.forEach((item) => {
            item.type === ElementType.Item && !items.includes(item.name) && items.push(item.name);
          });

          return items;
        },
        [],
      );

      let newItems = { ...items };
      decryptedAnswer.forEach((currentAnswer) => {
        if (subscalesItems?.includes(currentAnswer.activityItem.name)) return items;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const item = items[currentAnswer.activityItem.id!];

        if (!item) {
          const { activityItem, answers } = formatActivityItemAnswers(currentAnswer, endDatetime);
          newItems = {
            ...newItems,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            [currentAnswer.activityItem.id!]: [
              {
                activityItem,
                answers,
              },
            ],
          };

          return;
        }

        const currResponseType = currentAnswer.activityItem.responseType;
        const prevResponseTypes = item.reduce(
          (types: Record<string, number>, { activityItem }, index: number) => ({
            ...types,
            [activityItem.responseType]: index,
          }),
          {},
        );

        if (!(currResponseType in prevResponseTypes)) {
          const { activityItem, answers } = formatActivityItemAnswers(currentAnswer, endDatetime);
          const updatedItem = [...item];
          updatedItem.push({
            activityItem,
            answers,
          });

          newItems = {
            ...newItems,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            [currentAnswer.activityItem.id!]: updatedItem,
          };

          return;
        }

        const prevActivityItem = item[prevResponseTypes[currResponseType]];

        const { activityItem, answers } = compareActivityItem(
          prevActivityItem,
          currentAnswer,
          endDatetime,
        );

        const updatedItem = [...item];
        updatedItem[prevResponseTypes[currResponseType]] = {
          activityItem,
          answers,
        };

        newItems = {
          ...newItems,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          [currentAnswer.activityItem.id!]: updatedItem,
        };

        return;
      });

      return newItems;
    },
    {},
  );

  return {
    subscalesFrequency,
    formattedResponses,
  };
};

export const getTimeRangeReponse = (answer?: DecryptedDateRangeAnswer) => {
  if (!answer?.value)
    return {
      from: '',
      to: '',
    };

  const dateFrom = new Date();
  const dateTo = new Date();
  const {
    from: { hour: hourFrom, minute: minuteFrom },
    to: { hour: hourTo, minute: minuteTo },
  } = answer.value;

  dateFrom.setHours(hourFrom);
  dateFrom.setMinutes(minuteFrom);
  dateTo.setHours(hourTo);
  dateTo.setMinutes(minuteTo);

  return {
    from: format(dateFrom, DateFormats.Time),
    to: format(dateTo, DateFormats.Time),
  };
};
