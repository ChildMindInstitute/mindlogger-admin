import { Version } from 'api';
import { AutocompleteOption } from 'shared/components/FormComponents';
import { ItemResponseType } from 'shared/consts';
import {
  Item,
  SingleAndMultipleSelectItemResponseValues,
  SliderItemResponseValues,
} from 'shared/state/Applet/Applet.schema';
import {
  ActivityItemAnswer,
  DecryptedMultiSelectionAnswer,
} from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';
import { getObjectFromList } from 'shared/utils';
import { isItemUnsupported } from 'modules/Dashboard/features/RespondentData/RespondentData.utils';

import {
  DEFAULT_END_DATE,
  DEFAULT_END_TIME,
  DEFAULT_START_DATE,
  DEFAULT_START_TIME,
} from './Report.const';
import { Identifier } from '../RespondentDataSummary.types';
import { ActivityResponse, ItemAnswer } from './Report.types';

export const getDefaultFilterValues = (versions: Version[]) => {
  const versionsFilter = versions.map(({ version }) => ({ id: version, label: version }));

  return {
    startDateEndDate: [DEFAULT_START_DATE, DEFAULT_END_DATE],
    moreFiltersVisisble: false,
    startTime: DEFAULT_START_TIME,
    endTime: DEFAULT_END_TIME,
    versions: versionsFilter,
  };
};

export const getDateISO = (date: Date, time: string) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const [hours, mins] = time.split(':');

  const utcDate = Date.UTC(year, month, day, +hours, +mins);

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

export type FormattedResponse = {
  activityItem: Item;
  answers: ItemAnswer[];
};

const getAnswers = (currentAnswer: ActivityItemAnswer, date: Date | string) => {
  switch (currentAnswer.activityItem.responseType) {
    case ItemResponseType.MultipleSelection:
      return (currentAnswer.answer as DecryptedMultiSelectionAnswer).value.map((value) => ({
        answer: {
          value,
          text: null,
        },
        date,
      }));
    default:
      return [
        {
          answer: currentAnswer.answer,
          date,
        },
      ];
  }
};

const compareActivityItemAnswers = (
  prevActivityItemAnswer: FormattedResponse,
  currActivityItemAnswer: ActivityItemAnswer,
  date: string,
) => {
  const { activityItem: prevActivityItem, answers: prevAnswers } = prevActivityItemAnswer;
  const { activityItem: currActivityItem, answer: currAnswer } = currActivityItemAnswer;

  if (currActivityItem.responseType === ItemResponseType.SingleSelection) {
    const currActivityItemOptions = (
      currActivityItem.responseValues as SingleAndMultipleSelectItemResponseValues
    ).options;
    const prevActivityItemOptions = getObjectFromList(
      (prevActivityItem.responseValues as SingleAndMultipleSelectItemResponseValues).options,
    );

    const options = { ...prevActivityItemOptions, ...getObjectFromList(currActivityItemOptions) };

    return {
      activityItem: {
        ...currActivityItem,
        responseValues: {
          ...currActivityItem.responseValues,
          options: Object.values(options),
        },
      },
      answers: [
        ...prevAnswers,
        {
          answer: currAnswer,
          date,
        },
      ],
    };
  }

  if (currActivityItem.responseType === ItemResponseType.MultipleSelection) {
    const currActivityItemOptions = (
      currActivityItem.responseValues as SingleAndMultipleSelectItemResponseValues
    ).options;
    const prevActivityItemOptions = getObjectFromList(
      (prevActivityItem.responseValues as SingleAndMultipleSelectItemResponseValues).options,
    );

    const options = { ...prevActivityItemOptions, ...getObjectFromList(currActivityItemOptions) };

    const flattenAnswers = (currAnswer as DecryptedMultiSelectionAnswer).value.map((value) => ({
      answer: {
        value,
        text: null,
      },
      date,
    }));

    return {
      activityItem: {
        ...currActivityItem,
        responseValues: {
          ...currActivityItem.responseValues,
          options: Object.values(options),
        },
      },
      answers: [...prevAnswers, ...flattenAnswers],
    };
  }

  if (currActivityItem.responseType === ItemResponseType.Slider) {
    const currActivityItemOptions = currActivityItem.responseValues as SliderItemResponseValues;
    const prevActivityItemOptions = prevActivityItem.responseValues as SliderItemResponseValues;

    const minValue = Math.min(
      Number(prevActivityItemOptions.minValue),
      Number(currActivityItemOptions.minValue),
    );
    const maxValue = Math.max(
      Number(prevActivityItemOptions.maxValue),
      Number(currActivityItemOptions.maxValue),
    );

    return {
      activityItem: {
        ...currActivityItem,
        responseValues: {
          ...currActivityItem.responseValues,
          minValue,
          maxValue,
        },
      },
      answers: [
        ...prevAnswers,
        {
          answer: currAnswer,
          date,
        },
      ],
    };
  }

  if (currActivityItem.responseType === ItemResponseType.Text) {
    return {
      activityItem: currActivityItem,
      answers: [
        ...prevAnswers,
        {
          answer: currAnswer,
          date,
        },
      ],
    };
  }

  if (isItemUnsupported(currActivityItem.responseType)) {
    return {
      activityItem: currActivityItem,
      answers: [],
    };
  }
};

export const getFormattedResponses = (activityResponses: ActivityResponse[]) => {
  const formattedResponses = activityResponses.reduce(
    (
      items: Record<string, FormattedResponse>,
      { decryptedAnswer, endDatetime }: ActivityResponse,
    ) => {
      let newItems = { ...items };
      decryptedAnswer.forEach((currentAnswer) => {
        const item = items[currentAnswer.activityItem.id!];

        if (!item) {
          const answers = getAnswers(currentAnswer, endDatetime);
          newItems = {
            ...newItems,
            [currentAnswer.activityItem.id!]: {
              activityItem: currentAnswer.activityItem,
              answers,
            },
          };

          return;
        }

        const prevResponseType = item.activityItem.responseType;
        const currResponseType = currentAnswer.activityItem.responseType;

        if (prevResponseType === currResponseType) {
          const activityItemAnswers = compareActivityItemAnswers(item, currentAnswer, endDatetime);
          newItems = {
            ...newItems,
            [currentAnswer.activityItem.id!]: {
              activityItem: activityItemAnswers?.activityItem as Item,
              answers: activityItemAnswers?.answers as ItemAnswer[],
            },
          };
        }
      });

      return newItems;
    },
    {},
  );

  return Object.values(formattedResponses);
};
