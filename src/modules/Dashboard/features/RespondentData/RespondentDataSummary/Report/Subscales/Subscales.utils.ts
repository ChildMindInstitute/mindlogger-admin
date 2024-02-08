import { ActivitySettingsSubscale } from 'shared/state';
import { ActivityItemAnswer, ElementType } from 'shared/types';

import { ActivityCompletion, FormattedResponse } from '../Report.types';
import { compareActivityItem, formatActivityItemAnswers } from '../Report.utils';
import { ActivityCompletionToRender, GroupedSubscales, SubscaleToRender } from './Subscales.types';

export const getSubscalesToRender = (
  data: ActivitySettingsSubscale,
  activityItems: Record<string, ActivityItemAnswer>,
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
        result[data.name] as SubscaleToRender,
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

export const getAllSubscalesToRender = (
  allSubscalesToRender: SubscaleToRender,
  item: ActivityCompletion,
  subscale: ActivitySettingsSubscale,
  activityItems: Record<string, ActivityItemAnswer>,
) => {
  if (!allSubscalesToRender[subscale.name]) {
    allSubscalesToRender[subscale.name] = {
      restScores: {},
    };

    for (const subscaleItem of subscale.items) {
      if (subscaleItem.type === ElementType.Item) {
        const formattedItem = formatActivityItemAnswers(activityItems[subscaleItem.name], item.endDatetime);

        if (!allSubscalesToRender?.[subscale.name]?.items) {
          allSubscalesToRender[subscale.name] = {
            ...allSubscalesToRender[subscale.name],
            items: [formattedItem],
          };
        } else {
          allSubscalesToRender[subscale.name].items?.push(formattedItem);
        }
      } else {
        allSubscalesToRender[subscale.name] = {
          ...allSubscalesToRender[subscale.name],
          restScores: {
            ...allSubscalesToRender[subscale.name].restScores,
            [subscaleItem.name]: {},
          } as Record<string, never>,
        };
      }
    }

    return allSubscalesToRender;
  }

  for (const subscaleItem of subscale.items) {
    if (subscaleItem.type === ElementType.Item) {
      const itemIndex =
        allSubscalesToRender[subscale.name]?.items?.findIndex(item => item.activityItem.name === subscaleItem.name) ??
        -1;

      if (itemIndex < 0) {
        return allSubscalesToRender;
      }

      const { activityItem, answers } = compareActivityItem(
        allSubscalesToRender[subscale.name].items![itemIndex],
        activityItems[subscaleItem.name],
        item.endDatetime,
      );

      allSubscalesToRender[subscale.name].items![itemIndex] = {
        activityItem,
        answers,
      };
    }
  }

  return allSubscalesToRender;
};

export const formatCurrentSubscales = (currentSubscales: ActivityCompletionToRender) =>
  Object.keys(currentSubscales).reduce((formattedSubscales: ActivityCompletionToRender, subscaleName) => {
    const currItems = currentSubscales[subscaleName]?.items || [];
    const updatedItems = currItems?.reduce((items: Record<string, FormattedResponse>, formattedResponse) => {
      const prevActivityItem = items[formattedResponse.activityItem.id];
      if (!prevActivityItem) {
        return {
          ...items,
          [formattedResponse.activityItem.id]: formattedResponse,
        };
      }

      return items;
    }, {});

    return {
      ...formattedSubscales,
      [subscaleName]: {
        ...currentSubscales[subscaleName],
        items: Object.values(updatedItems),
      },
    };
  }, {});

export const groupSubscales = (
  data: ActivityCompletionToRender,
  main: ActivityCompletionToRender,
): GroupedSubscales => {
  const currRestScoresValues = Object.values(data);
  const currRestScores = currRestScoresValues.reduce(
    (subscales: ActivityCompletionToRender, subscale) => ({
      ...subscales,
      ...subscale.restScores,
    }),
    {},
  );

  const root = Object.keys(data).reduce((acc: GroupedSubscales, curr) => {
    if (currRestScores[curr]) return acc;
    const restScores = data[curr]?.restScores ?? {};
    const scores = Object.keys(restScores);

    const updatedRestScores = scores.reduce(
      (restScores, currRestScore) => ({
        ...restScores,
        [currRestScore]: {
          ...data[currRestScore],
        },
      }),
      {},
    );

    return {
      ...acc,
      [curr]: {
        ...data[curr],
        restScores: updatedRestScores,
      },
    };
  }, {});

  return Object.keys(root).reduce(
    (groupedSubscales: GroupedSubscales, subscaleName) => {
      const restScores = root[subscaleName]?.restScores ?? {};
      if (!Object.keys(restScores).length) {
        return {
          ...groupedSubscales,
          [subscaleName]: {
            ...main[subscaleName],
            restScores,
          },
        } as GroupedSubscales;
      }

      return {
        ...groupedSubscales,
        [subscaleName]: {
          ...root[subscaleName],
          restScores: groupSubscales(restScores as unknown as ActivityCompletionToRender, main),
        },
      } as GroupedSubscales;
    },
    { ...root },
  );
};
