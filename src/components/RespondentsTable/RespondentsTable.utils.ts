import { UserData, UsersItems } from 'redux/modules';

export const prepareUsersData = (items?: UsersItems['items'], id?: string) =>
  id && items
    ? items.reduce((acc: UserData[] | null, currentValue) => {
        if (currentValue[id] && acc) {
          return acc.concat(currentValue[id]);
        }

        return null;
      }, [])
    : items &&
      items
        .map((item) => Object.values(item))
        .reduce((acc: UserData[] | null, currentValue) => {
          if (currentValue && acc) {
            return acc.concat(currentValue);
          }

          return null;
        }, []);
