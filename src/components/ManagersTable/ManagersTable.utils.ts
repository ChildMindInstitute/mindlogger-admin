import { ManagersItems, ManagerData } from 'redux/modules';
import { FOOTER_HEIGHT, SEARCH_HEIGHT, TABS_HEIGHT, TOP_BAR_HEIGHT } from 'utils/constants';

export const prepareManagersData = (items?: ManagersItems['items'], id?: string) =>
  id && items
    ? items.reduce((acc: ManagerData[] | null, currentValue) => {
        if (currentValue[id] && acc) {
          return acc.concat(currentValue[id]);
        }

        return null;
      }, [])
    : items &&
      items
        .map((item) => Object.values(item))
        .reduce((acc: ManagerData[] | null, currentValue) => {
          if (currentValue && acc) {
            return acc.concat(currentValue);
          }

          return null;
        }, []);

export const tableHeight = `calc(100vh - ${TOP_BAR_HEIGHT} - ${FOOTER_HEIGHT} - ${TABS_HEIGHT} - ${SEARCH_HEIGHT} - 6.4rem)`;
