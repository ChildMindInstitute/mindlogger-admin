import { ActivitySettingsSubscale } from 'shared/state';
import { ElementType } from 'modules/Builder/features/SaveAndPublish/SaveAndPublish.types';

import { formatActivityItemAnswers } from '../Report.utils';

export const getSubscalesToRender = (
  data: ActivitySettingsSubscale,
  activityItems: any,
  subscalesObject: any,
  result: any,
): any => {
  if (!data?.items || !result) {
    return result;
  }

  for (const item of data.items) {
    if (item.type === ElementType.Subscale) {
      const nestedSubscale = getSubscalesToRender(
        subscalesObject[item.name],
        activityItems,
        subscalesObject,
        result[data.name],
      );
      if (!result?.[data.name]) {
        result[data.name] = { nestedSubscale };
      } else {
        result[data.name] = {
          ...result[data.name],
        };
      }
    } else {
      const formatted = formatActivityItemAnswers(
        activityItems[item.name],
        activityItems[item.name].endDatetime,
      );
      if (!result?.[data.name]?.items) {
        result[data.name] = { items: [formatted] };
      } else {
        result[data.name].items.push(formatted);
      }
    }
  }

  return result;
};
