import { SubscaleTotalScore } from 'shared/consts';
import { mockedSingleSelectFormValues, mockedSubscale1, mockedSubscale2 } from 'shared/mock';
import { getObjectFromList } from 'shared/utils';

import { getItemElements, getPropertiesToFilterByIds } from './SubscalesConfiguration.utils';
import {
  getItemElementName,
  getItemNameInSubscale,
  getSubscalesDefaults,
  getSubscaleElementName,
} from './SubscalesConfiguration.utils';

jest.mock('uuid', () => ({
  __esModule: true,
  ...jest.requireActual('uuid'),
  v4: () => 'mocked-id',
}));

describe('SubscalesConfiguration.utils', () => {
  describe('getSubscalesDefaults', () => {
    test('returns defaults for subscale', () => {
      expect(getSubscalesDefaults()).toStrictEqual({
        name: '',
        scoring: SubscaleTotalScore.Sum,
        items: [],
        id: 'mocked-id',
      });
    });
  });

  describe('getItemNameInSubscale', () => {
    test('returns formatted item name', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(getItemNameInSubscale(mockedSingleSelectFormValues)).toStrictEqual('Item: Item1');
    });
  });

  describe('getItemElementName', () => {
    test('returns formatted element name', () => {
      expect(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getItemElementName({
          ...mockedSingleSelectFormValues,
          question: '~~Lorem ipsum~~',
        }),
      ).toStrictEqual('Item: Item1: Lorem ipsum');
    });
  });

  const subscale1 = {
    ...mockedSubscale1,
    items: mockedSubscale1.items.map((item) => item.id),
  };
  const subscale2 = {
    ...mockedSubscale2,
    items: mockedSubscale2.items.map((item) => item.id),
  };
  const itemsMap1 = getObjectFromList(mockedSubscale1.items.filter((item) => item.type === 'item'));
  const itemsMap2 = getObjectFromList(mockedSubscale2.items.filter((item) => item.type === 'item'));
  const subscalesMap = getObjectFromList([subscale1, subscale2]); //, (item) => item.name
  describe('getSubscaleElementName', () => {
    test.each([
      [
        'should return item names within subscale',
        subscale1,
        itemsMap1,
        'Subscale: ss-1 (Item: single, Item: multi, Item: slider)',
      ],
      [
        'should return item name and subscale name within subscale',
        subscale2,
        itemsMap2,
        'Subscale: ss-2 (Subscale: ss-1, Item: single)',
      ],
    ])('%s', (_, subscale, itemsMap, expected) => {
      expect(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getSubscaleElementName(subscale, subscalesMap, itemsMap),
      ).toBe(expected);
    });
  });

  describe('getItemElements', () => {
    test.each([
      ['should return empty list', subscale1.id, [], [subscale1, subscale2], []],
      [
        'should return filled elements for subscale1',
        subscale1.id,
        mockedSubscale1.items.filter((item) => item.type === 'item'),
        [subscale1, subscale2],
        [
          {
            id: 'single-1',
            name: 'Item: single: lorem ipsum single',
          },
          {
            id: 'multi-1',
            name: 'Item: multi: lorem ipsum multi',
          },
          {
            id: 'slider-1',
            name: 'Item: slider: lorem ipsum slider',
          },
        ],
      ],
      [
        'should return filled elements for subscale2',
        subscale2.id,
        mockedSubscale2.items.filter((item) => item.type === 'item'),
        [subscale1, subscale2],
        [
          {
            id: 'subscale-1',
            name: 'Subscale: ss-1 (Item: single)',
          },
          {
            id: 'single-1',
            name: 'Item: single: lorem ipsum single',
          },
        ],
      ],
      [
        'should return filled elements with empty subscale list',
        subscale2.id,
        mockedSubscale2.items.filter((item) => item.type === 'item'),
        [],
        [
          {
            id: 'single-1',
            name: 'Item: single: lorem ipsum single',
          },
        ],
      ],
    ])('%s', (_, subscaleId, items, subscales, expected) => {
      expect(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getItemElements(subscaleId, items, subscales),
      ).toStrictEqual(expected);
    });
  });

  describe('getPropertiesToFilterByIds', () => {
    const expectedResult1 = {
      itemsMap: itemsMap1,
      markedUniqueElementsIds: ['single-1', 'multi-1', 'slider-1', 'subscale-1'],
      mergedIds: ['subscale-1', 'subscale-2', 'single-1', 'multi-1', 'slider-1'],
      subscalesMap: {
        'subscale-1': subscale1,
        'subscale-2': subscale2,
      },
    };
    const expectedResult2 = {
      itemsMap: {},
      markedUniqueElementsIds: ['single-1', 'multi-1', 'slider-1', 'subscale-1'],
      mergedIds: ['subscale-1', 'subscale-2'],
      subscalesMap: {
        'subscale-1': subscale1,
        'subscale-2': subscale2,
      },
    };
    const expectedResult3 = {
      itemsMap: itemsMap1,
      markedUniqueElementsIds: [],
      mergedIds: ['single-1', 'multi-1', 'slider-1'],
      subscalesMap: {},
    };
    test.each([
      [
        'should return filled object',
        mockedSubscale1.items,
        [subscale1, subscale2],
        expectedResult1,
      ],
      [
        'should return empty list when items are empty',
        [],
        [subscale1, subscale2],
        expectedResult2,
      ],
      [
        'should return empty list when subscales are empty',
        mockedSubscale1.items,
        [],
        expectedResult3,
      ],
    ])('%s', (_, items, subscales, expected) => {
      expect(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getPropertiesToFilterByIds(items, subscales),
      ).toStrictEqual(expected);
    });
  });

  describe('getNotUsedElements', () => {});

  describe('getUsedWithinSubscalesElements', () => {});

  describe('getColumns', () => {});

  describe('getNotUsedElementsTableColumns', () => {});

  describe('getAllElementsTableColumns', () => {});

  describe('getSubscaleModalLabels', () => {});

  describe('getAddTotalScoreModalLabels', () => {});
});
