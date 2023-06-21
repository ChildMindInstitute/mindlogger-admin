import { ActivitySettingsSubscale } from 'shared/state';

const calcSubscales = (items: any[], activityItems: any) =>
  items.reduce((acc: any, item) => {
    const answer = activityItems[item].answer;
    const opts = activityItems[item]?.options;
    let value = 0;
    if (opts?.options) {
      const scoresObject = opts.options.reduce((acc: any, item: any) => {
        acc[item.value] = item.score;

        return acc;
      }, {});

      if (typeof answer.value === 'string') {
        value = scoresObject[answer.value];
      } else {
        value = answer.value.reduce((res: any, item: any) => res + scoresObject[item], 0);
      }
    }

    return acc + value;
  }, 0);

export const getSubscales = (subscales?: ActivitySettingsSubscale[], activityItems?: any) =>
  subscales?.reduce((acc: any, item) => {
    acc[item.name] = calcSubscales(item.items, activityItems);
    if (item?.subscaleTableData) {
      acc[`Optional text for ${item.name}`] = item.subscaleTableData;
    }

    return acc;
  }, {});
