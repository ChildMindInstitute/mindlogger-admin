// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ItemFormValues } from 'modules/Builder/types';
import { ConditionType, ItemResponseType } from 'shared/consts';

import { getConditionItemType, getPayload, getValueOptionsList } from './ConditionRow.utils';
import { ConditionItemType } from './Condition/Condition.const';

describe('getConditionItemType', () => {
  test.each([
    [ItemResponseType.Slider, ConditionItemType.Slider],
    [ItemResponseType.SingleSelection, ConditionItemType.SingleSelection],
    [ItemResponseType.MultipleSelection, ConditionItemType.MultiSelection],
    ['InvalidResponseType', ConditionItemType.SingleSelection], // default
    [undefined, ConditionItemType.SingleSelection], // default
  ])('returns correct condition item type for response type "%s"', (responseType, expected) => {
    const item: ItemFormValues = { responseType };
    const result = getConditionItemType(item);
    expect(result).toBe(expected);
  });
});

describe('getPayload', () => {
  test.each`
    condition                                                                                                                                              | expectedPayload
    ${{ conditionType: ConditionType.IncludesOption, conditionPayload: { optionValue: 'optionValue' } }}                                                   | ${{ optionValue: 'optionValue' }}
    ${{ conditionType: ConditionType.IncludesOption }}                                                                                                     | ${{ optionValue: '' }}
    ${{ conditionType: ConditionType.GreaterThan, selectedItem: { responseType: ItemResponseType.Slider, responseValues: { minValue: 1, maxValue: 5 } } }} | ${{ value: 1 }}
    ${{ conditionType: ConditionType.GreaterThan, conditionPayload: { value: 2 } }}                                                                        | ${{ value: 2 }}
    ${{ conditionType: ConditionType.LessThan, selectedItem: { responseType: ItemResponseType.Slider, responseValues: { minValue: 1, maxValue: 5 } } }}    | ${{ value: 5 }}
    ${{ conditionType: ConditionType.LessThan, conditionPayload: { value: 2 } }}                                                                           | ${{ value: 2 }}
    ${{ conditionType: ConditionType.Equal, conditionPayload: { value: 1 } }}                                                                              | ${{ value: 1 }}
    ${{ conditionType: ConditionType.Between, selectedItem: { responseType: ItemResponseType.Slider, responseValues: { minValue: 1, maxValue: 5 } } }}     | ${{ minValue: 1, maxValue: 5 }}
    ${{ conditionType: ConditionType.OutsideOf }}                                                                                                          | ${{ maxValue: 10, minValue: 0 }}
    ${{ conditionType: 'UnknownType' as ConditionType }}                                                                                                   | ${{}}
  `('returns payload for condition $condition.conditionType', ({ condition, expectedPayload }) => {
    const payload = getPayload(condition);
    expect(payload).toEqual(expectedPayload);
  });
});

describe('getValueOptionsList', () => {
  const options = [
    {
      id: 'id',
      text: 'text',
    },
  ];
  const expectedOptions = [
    {
      value: 'id',
      labelKey: 'text',
    },
  ];
  test('returns empty array if item is not provided', () => {
    const result = getValueOptionsList(null);
    expect(result).toEqual([]);
  });

  test.each([
    [
      ItemResponseType.SingleSelection,
      {
        responseType: ItemResponseType.SingleSelection,
        responseValues: {
          options,
        },
      },
      expectedOptions,
    ],
    [
      ItemResponseType.MultipleSelection,
      { responseType: ItemResponseType.MultipleSelection, responseValues: { options } },
      expectedOptions,
    ],
    [
      ItemResponseType.SingleSelectionPerRow,
      { responseType: ItemResponseType.SingleSelectionPerRow, responseValues: { options } },
      expectedOptions,
    ],
    [
      ItemResponseType.MultipleSelectionPerRow,
      { responseType: ItemResponseType.MultipleSelectionPerRow, responseValues: { options } },
      expectedOptions,
    ],
    [
      ItemResponseType.Text,
      { responseType: ItemResponseType.Text, responseValues: { options } },
      [],
    ],
    [
      ItemResponseType.Slider,
      { responseType: ItemResponseType.Slider, responseValues: { options: [] } },
      [],
    ],
  ])(
    'returns correct value options list for item with responseType "%s"',
    (responseType, item, expected) => {
      const result = getValueOptionsList(item as ItemFormValues);
      expect(result).toEqual(expected);
    },
  );
});
