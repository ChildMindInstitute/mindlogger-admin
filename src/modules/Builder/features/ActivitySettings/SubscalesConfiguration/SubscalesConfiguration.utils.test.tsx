import { SubscaleTotalScore } from 'shared/consts';
import { mockedSingleSelectFormValues, mockedSubscale1, mockedSubscale2 } from 'shared/mock';
import { getObjectFromList } from 'shared/utils';

import { getItemElements, getPropertiesToFilterByIds } from './SubscalesConfiguration.utils';
import {
  getItemElementName,
  getItemNameInSubscale,
  getSubscalesDefaults,
  getSubscaleElementName,
  getNotUsedElements,
  getUsedWithinSubscalesElements,
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
  const subscalesMap = getObjectFromList([subscale1, subscale2]);
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

  describe('calculate usage of elements around subscales', () => {
    const subscales = [
      {
        name: 'ss1',
        scoring: 'sum',
        items: [
          '3a2b0214-392f-4434-80ae-598e7e1a688c',
          'bf2c667c-c07e-4514-b9f1-ae48e7868920',
          '3bdcab81-7b58-439a-8c2f-6a01a0cfaec6',
        ],
        subscaleTableData: null,
        id: 'ec146e86-4f30-46e3-bbe1-6138864f0879',
      },
      {
        name: 'ss2',
        scoring: 'sum',
        items: ['3a2b0214-392f-4434-80ae-598e7e1a688c'],
        subscaleTableData: null,
        id: 'c27070ea-236d-4056-8a14-a322607cab7b',
      },
      {
        name: 'ss3',
        scoring: 'sum',
        items: ['bf2c667c-c07e-4514-b9f1-ae48e7868920'],
        subscaleTableData: null,
        id: '3bdcab81-7b58-439a-8c2f-6a01a0cfaec6',
      },
    ];
    const subscalesMap = getObjectFromList(subscales);
    const items = [
      {
        id: '3a2b0214-392f-4434-80ae-598e7e1a688c',
        name: 'ss1',
        question: 'ss1',
        responseType: 'singleSelect',
      },
      {
        id: 'bf2c667c-c07e-4514-b9f1-ae48e7868920',
        name: 'ms1',
        question: 'ms1',
        responseType: 'multiSelect',
      },
      {
        id: '3d2faa89-4773-4701-b69a-09247e65cbfd',
        name: 'sl1',
        question: 'sl1',
        responseType: 'slider',
      },
    ];
    const itemsMap = getObjectFromList(items);
    const mergedIds = [
      'ec146e86-4f30-46e3-bbe1-6138864f0879',
      'c27070ea-236d-4056-8a14-a322607cab7b',
      '3bdcab81-7b58-439a-8c2f-6a01a0cfaec6',
      '3a2b0214-392f-4434-80ae-598e7e1a688c',
      'bf2c667c-c07e-4514-b9f1-ae48e7868920',
      '3d2faa89-4773-4701-b69a-09247e65cbfd',
    ];
    const markedUniqueElementsIds = [
      '3d2faa89-4773-4701-b69a-09247e65cbfd',
      'bf2c667c-c07e-4514-b9f1-ae48e7868920',
      '3a2b0214-392f-4434-80ae-598e7e1a688c',
    ];
    const expectedNotUsedElements = [
      {
        id: 'ec146e86-4f30-46e3-bbe1-6138864f0879',
        name: 'Subscale: ss1 (Item: ss1, Item: ms1, Subscale: ss3)',
      },
      {
        id: 'c27070ea-236d-4056-8a14-a322607cab7b',
        name: 'Subscale: ss2 (Item: ss1)',
      },
      {
        id: '3bdcab81-7b58-439a-8c2f-6a01a0cfaec6',
        name: 'Subscale: ss3 (Item: ms1)',
      },
    ];
    const expectedElementsWithinSubscale = [
      {
        element: 'Item: ss1',
        id: '3a2b0214-392f-4434-80ae-598e7e1a688c',
        subscale: 'ss1, ss2',
      },
      {
        element: 'Item: ms1',
        id: 'bf2c667c-c07e-4514-b9f1-ae48e7868920',
        subscale: 'ss1, ss3',
      },
      {
        element: 'Item: sl1',
        id: '3d2faa89-4773-4701-b69a-09247e65cbfd',
        subscale: '',
      },
    ];

    describe('getNotUsedElements', () => {
      test.each([
        [
          'should return not used elements',
          subscalesMap,
          itemsMap,
          mergedIds,
          markedUniqueElementsIds,
          expectedNotUsedElements,
        ],
      ])('%s', (_, subscalesMap, itemsMap, mergedIds, markedUniqueElementsIds, expectedResult) => {
        expect(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          getNotUsedElements(subscalesMap, itemsMap, mergedIds, markedUniqueElementsIds),
        ).toStrictEqual(expectedResult);
      });
    });

    describe('getUsedWithinSubscalesElements', () => {
      test.each([
        [
          'should return used element within subscale',
          subscales,
          subscalesMap,
          itemsMap,
          mergedIds,
          markedUniqueElementsIds,
          expectedElementsWithinSubscale,
        ],
      ])(
        '%s',
        (
          _,
          subscales,
          subscalesMap,
          itemsMap,
          mergedIds,
          markedUniqueElementsIds,
          expectedResult,
        ) => {
          expect(
            getUsedWithinSubscalesElements(
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              subscales,
              subscalesMap,
              itemsMap,
              mergedIds,
              markedUniqueElementsIds,
            ),
          ).toStrictEqual(expectedResult);
        },
      );
    });
  });
});
