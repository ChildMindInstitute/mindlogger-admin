import { ActivitySettingsSubscale } from 'shared/state';

export const getSubscales = (subscales?: ActivitySettingsSubscale[], activityId?: string) =>
  subscales?.reduce((acc: { [key: string]: string | Record<string, string>[] }, item) => {
    acc[item.name] = activityId === item?.items?.[0] ? '1' : '';
    if (item?.subscaleTableData) {
      acc[`Optional text for ${item.name}`] = item.subscaleTableData;
    }

    return acc;
  }, {});
