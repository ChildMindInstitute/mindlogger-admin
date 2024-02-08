import { STORAGE_LIBRARY_KEY, STORAGE_SELECTED_KEY } from '../consts';
import {
  getAppletsFromStorage,
  getSelectedAppletFromStorage,
  getSelectedItemsFromStorage,
  updateSelectedItemsInStorage,
} from './dataFromStorage';

const mockedSessionStorage = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem(key: string): string | null {
      return store[key] || null;
    },
    setItem(key: string, value: string): void {
      store[key] = value.toString();
    },
    removeItem(key: string): void {
      delete store[key];
    },
    clear(): void {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: mockedSessionStorage,
});

const mockedSelectedItems = {
  applet1: [
    {
      itemNamePlusActivityName: 'Item1',
      activityNamePlusId: 'Activity1ID',
      activityName: 'Activity1',
      activityKey: 'Key1',
    },
  ],
};

describe('Storage functions', () => {
  afterEach(() => {
    window.sessionStorage.clear();
  });

  describe('getAppletsFromStorage', () => {
    test('should retrieve applets from sessionStorage', () => {
      const applets = [
        { id: 'applet1', name: 'Applet One' },
        { id: 'applet2', name: 'Applet Two' },
      ];
      window.sessionStorage.setItem(STORAGE_LIBRARY_KEY, JSON.stringify(applets));
      expect(getAppletsFromStorage()).toEqual(applets);
    });

    test('should return an empty array if no applets are in sessionStorage', () => {
      expect(getAppletsFromStorage()).toEqual([]);
    });
  });

  describe('getSelectedItemsFromStorage', () => {
    test('should retrieve selected items from sessionStorage', () => {
      window.sessionStorage.setItem(STORAGE_SELECTED_KEY, JSON.stringify(mockedSelectedItems));
      expect(getSelectedItemsFromStorage()).toEqual(mockedSelectedItems);
    });

    test('should return an empty object if no selected items are in sessionStorage', () => {
      expect(getSelectedItemsFromStorage()).toEqual({});
    });
  });

  describe('getSelectedAppletFromStorage', () => {
    test('should retrieve the selected applet by id', () => {
      window.sessionStorage.setItem(STORAGE_SELECTED_KEY, JSON.stringify(mockedSelectedItems));
      expect(getSelectedAppletFromStorage('applet1')).toEqual(mockedSelectedItems['applet1']);
    });

    test('should return undefined if the applet is not selected', () => {
      expect(getSelectedAppletFromStorage('applet2')).toBeUndefined();
    });
  });

  describe('updateSelectedItemsInStorage', () => {
    test('should update the selected items in sessionStorage', () => {
      updateSelectedItemsInStorage(mockedSelectedItems, 'applet1');
      expect(JSON.parse(window.sessionStorage.getItem(STORAGE_SELECTED_KEY) || '{}')).toEqual(mockedSelectedItems);
    });

    test('should remove the selected items from sessionStorage if updated items are null', () => {
      updateSelectedItemsInStorage({}, 'applet1');
      expect(window.sessionStorage.getItem(STORAGE_SELECTED_KEY)).toBeNull();
    });

    test('should return an object indicating if there are no selected items', () => {
      let result = updateSelectedItemsInStorage({}, 'applet1');
      expect(result.isNoSelectedItems).toBe(true);
      result = updateSelectedItemsInStorage(mockedSelectedItems, 'applet1');
      expect(result.isNoSelectedItems).toBe(false);
    });
  });
});
