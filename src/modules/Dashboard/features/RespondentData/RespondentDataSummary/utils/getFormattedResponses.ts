import { ActivitySettingsSubscale } from 'shared/state/Applet';
import { ElementType } from 'shared/types/answer';

import { ActivityCompletion, FormattedResponses } from '../../RespondentData.types';
import { formatActivityItemAnswers } from './formatActivityItemAnswers';
import { compareActivityItem } from './compareActivityItem';

export const getFormattedResponses = (activityResponses: ActivityCompletion[]) => {
  let subscalesFrequency = 0;
  const formattedResponses = activityResponses.reduce(
    (
      items: Record<string, FormattedResponses[]>,
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
          const formattedActivityItemAnswers = formatActivityItemAnswers(
            currentAnswer,
            endDatetime,
          );
          newItems = {
            ...newItems,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            [currentAnswer.activityItem.id!]: [formattedActivityItemAnswers],
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
          const formattedActivityItemAnswers = formatActivityItemAnswers(
            currentAnswer,
            endDatetime,
          );
          const updatedItem = [...item];
          updatedItem.push(formattedActivityItemAnswers);

          newItems = {
            ...newItems,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            [currentAnswer.activityItem.id!]: updatedItem,
          };

          return;
        }

        const prevActivityItem = item[prevResponseTypes[currResponseType]];

        const formattedActivityItemAnswers = compareActivityItem(
          prevActivityItem,
          currentAnswer,
          endDatetime,
        );

        const updatedItem = [...item];
        updatedItem[prevResponseTypes[currResponseType]] = formattedActivityItemAnswers;

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
