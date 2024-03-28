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
  test('returns optionValue for INCLUDES_OPTION', () => {
    const payload = getPayload({
      conditionType: ConditionType.IncludesOption,
      conditionPayload: {
        optionValue: 'optionValue',
      },
    });
    expect(payload).toEqual({ optionValue: 'optionValue' });
  });

  test('returns empty string for INCLUDES_OPTION when conditionPayload is missed', () => {
    const payload = getPayload({
      conditionType: ConditionType.IncludesOption,
    });
    expect(payload).toEqual({ optionValue: '' });
  });

  test('returns minValue for GREATER_THAN and responseType = slider', () => {
    const payload = getPayload({
      conditionType: ConditionType.GreaterThan,
      selectedItem: {
        responseType: ItemResponseType.Slider,
        responseValues: { minValue: 1, maxValue: 5 },
      },
    });
    expect(payload).toEqual({ value: 1 });
  });

  test('returns value for GREATER_THAN and responseType != slider', () => {
    const payload = getPayload({
      conditionType: ConditionType.GreaterThan,
      conditionPayload: {
        value: 2,
      },
    });
    expect(payload).toEqual({ value: 2 });
  });

  test('returns maxValue for LESS_THAN and responseType = slider', () => {
    const payload = getPayload({
      conditionType: ConditionType.LessThan,
      selectedItem: {
        responseType: ItemResponseType.Slider,
        responseValues: { minValue: 1, maxValue: 5 },
      },
    });
    expect(payload).toEqual({ value: 5 });
  });

  test('returns value for LESS_THAN and responseType != slider', () => {
    const payload = getPayload({
      conditionType: ConditionType.LessThan,
      conditionPayload: {
        value: 2,
      },
    });
    expect(payload).toEqual({ value: 2 });
  });

  test('returns value for EQUAL', () => {
    const payload = getPayload({
      conditionType: ConditionType.Equal,
      conditionPayload: {
        value: 1,
      },
    });
    expect(payload).toEqual({ value: 1 });
  });

  test('returns minValue and maxValue for BETWEEN and responseType = slider', () => {
    const payload = getPayload({
      conditionType: ConditionType.Between,
      selectedItem: {
        responseType: ItemResponseType.Slider,
        responseValues: { minValue: 1, maxValue: 5 },
      },
    });
    expect(payload).toEqual({ minValue: 1, maxValue: 5 });
  });

  test('returns default values for OUTSIDE_OF and responseType != slider', () => {
    const payload = getPayload({
      conditionType: ConditionType.OutsideOf,
    });
    expect(payload).toEqual({ maxValue: 10, minValue: 0 });
  });

  test('returns empty object for unknown condition type', () => {
    const payload = getPayload({ conditionType: 'UnknownType' as ConditionType });
    expect(payload).toEqual({});
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
