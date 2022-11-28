import { UserData, UsersItems } from 'redux/modules';

export const prepareAppletUsersData = (id: string, items?: UsersItems['items']) =>
  items &&
  items.reduce((acc: UserData[] | null, currentValue) => {
    if (currentValue[id] && acc) {
      return acc.concat(currentValue[id]);
    }

    return null;
  }, []);

export const prepareAllUsersData = (items?: UsersItems['items']) =>
  items &&
  items
    .map((item) => Object.values(item))
    .reduce((acc: UserData[] | null, currentValue) => {
      if (currentValue && acc) {
        return acc.concat(currentValue);
      }

      return null;
    }, []);
