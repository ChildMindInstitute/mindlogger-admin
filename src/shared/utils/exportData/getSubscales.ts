import { ActivitySettingsSubscale } from 'shared/state';

export const getSubscales = (subscales?: ActivitySettingsSubscale[]) =>
  subscales?.reduce((acc: { [key: string]: string | Record<string, string>[] }, item) => {
    acc[item.name] = '1';
    if (item?.subscaleTableData) {
      acc[`Optional text for ${item.name}`] = item.subscaleTableData;
    }

    return acc;
  }, {});
