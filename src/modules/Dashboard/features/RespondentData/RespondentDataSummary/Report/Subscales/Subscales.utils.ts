import { ActivitySettingsSubscale, Item } from 'shared/state';
import { AnswerDTO, ElementType } from 'shared/types';

import { formatActivityItemAnswers } from '../Report.utils';
import { SubscaleToRender } from './Subscales.types';

export const getSubscalesToRender = (
  data: ActivitySettingsSubscale,
  activityItems: Record<string, { answer: AnswerDTO; activityItem: Item }>,
  subscalesObject: Record<string, ActivitySettingsSubscale>,
  endDatetime: string,
  result: SubscaleToRender,
) => {
  if (!data?.items || !result) {
    return result;
  }

  for (const item of data.items) {
    if (item.type === ElementType.Subscale) {
      const nestedSubscale = getSubscalesToRender(
        subscalesObject[item.name],
        activityItems,
        subscalesObject,
        endDatetime,
        result[data.name],
      );

      if (!result?.[data.name]) {
        result[data.name] = nestedSubscale;
      }
    } else {
      const formattedItem = formatActivityItemAnswers(activityItems[item.name], endDatetime);
      if (!result?.[data.name]?.items) {
        result[data.name] = { items: [formattedItem] };
      } else {
        result[data.name].items?.push(formattedItem);
      }
    }
  }

  return result;
};
