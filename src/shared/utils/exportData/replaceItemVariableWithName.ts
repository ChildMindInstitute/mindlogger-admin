import {
  AnswerDTO,
  DecryptedDateAnswer,
  DecryptedDateRangeAnswer,
  DecryptedMultiSelectionAnswer,
  DecryptedSingleSelectionAnswer,
  DecryptedSliderAnswer,
} from 'shared/types';
import { Item, SingleAndMultipleSelectItemResponseValues } from 'shared/state';
import { ItemResponseType } from 'shared/consts';

import { getObjectFromList } from '../getObjectFromList';

const getTimeString = (obj?: DecryptedDateRangeAnswer['value']['from' | 'to']) => {
  if (!obj) return '';

  return `${obj.hour.toString().padStart(2, '0')}:${obj.minute.toString().padStart(2, '0')}`;
};

const getDateString = (obj?: DecryptedDateAnswer['value']) => {
  if (!obj) return '';

  return `${obj.year}-${Number(obj.month).toString().padStart(2, '0')}-${Number(obj.day)
    .toString()
    .padStart(2, '0')}`;
};

export const doubleBrackets = /\[\[(.*?)]]/g;
export const getTextBetweenBrackets = (str: string) => {
  const listOfText = [];
  let found;
  while ((found = doubleBrackets.exec(str))) {
    listOfText.push(found[1]);
  }

  return listOfText;
};

export const replaceItemVariableWithName = <T>({
  markdown,
  items,
  rawAnswersObject,
}: {
  markdown: string;
  items: Item[];
  rawAnswersObject: Record<string, T & { answer: AnswerDTO }>;
}) => {
  try {
    const variableNames = getTextBetweenBrackets(markdown);
    if (!variableNames?.length) return markdown;

    const itemsObject = getObjectFromList(items, (item) => item.name);

    variableNames.forEach((variableName) => {
      const reg = new RegExp(`\\[\\[${variableName}\\]\\]`, 'gi');
      const itemValue = itemsObject[variableName];
      const answerValue = rawAnswersObject[variableName];
      const rawAnswer = answerValue?.answer;

      if (rawAnswer && Array.isArray((rawAnswer as DecryptedMultiSelectionAnswer).value)) {
        const names: string[] = [];
        (rawAnswer as DecryptedMultiSelectionAnswer).value.forEach((value) => {
          const item =
            (itemValue.responseValues as SingleAndMultipleSelectItemResponseValues).options?.find(
              (option) => String(option.value) === String(value),
            ) ?? null;

          if (item) names.push(item.text);
        });
        markdown = markdown.replace(reg, `${names.join(', ')} `);
      } else if (rawAnswer && typeof rawAnswer === 'object') {
        switch (itemValue.responseType) {
          case ItemResponseType.SingleSelection: {
            const item = itemValue.responseValues.options.find(
              (option) =>
                String(option.value) ===
                String((rawAnswer as DecryptedSingleSelectionAnswer).value),
            );
            if (item) {
              markdown = markdown.replace(reg, `${item.text} `);
            }
            break;
          }
          case ItemResponseType.Slider:
          case ItemResponseType.NumberSelection:
            markdown = markdown.replace(reg, `${(rawAnswer as DecryptedSliderAnswer).value} `);
            break;
          case ItemResponseType.TimeRange:
            markdown = markdown.replace(
              reg,
              `${getTimeString(
                (rawAnswer as DecryptedDateRangeAnswer).value.from,
              )} - ${getTimeString((rawAnswer as DecryptedDateRangeAnswer).value.to)} `,
            );
            break;
          case ItemResponseType.Date:
            markdown = markdown.replace(
              reg,
              `${getDateString((rawAnswer as DecryptedDateAnswer).value)} `,
            );
            break;
        }
      } else if (rawAnswer) {
        markdown = markdown.replace(reg, rawAnswer.toString().replace(/(?=[$&])/g, '\\'));
      }

      markdown = markdown.replace(reg, ' ');
    });
  } catch (error) {
    console.warn(error);
  }

  return markdown;
};
