import { format } from 'date-fns';

import { DateFormats } from 'shared/consts';

import { formatToNumberArray, hasAnswerValue, getUpdatedValues } from './FeedbackAssessment.utils';

const multiSelectWithoutAnswersNonEdited = { itemId: 'item1', answers: [], edited: null };
const singleSelectWithAnswersNonEdited = { itemId: 'item1', answers: 1, edited: null };

describe('formatToNumberArray', () => {
  test.each`
    stringArray             | expected        | description
    ${[]}                   | ${[]}           | ${'should return an empty array when the input array is empty'}
    ${['1', '2', '3', '4']} | ${[1, 2, 3, 4]} | ${'should convert an array of strings to an array of numbers'}
  `('$description', ({ stringArray, expected }) => {
    const result = formatToNumberArray(stringArray);
    expect(result).toEqual(expected);
  });
});

describe('hasAnswerValue', () => {
  test.each`
    value                 | expected | description
    ${''}                 | ${false} | ${'should return false for an empty string'}
    ${[]}                 | ${false} | ${'should return false for an empty array'}
    ${'Hello World!'}     | ${true}  | ${'should return true for a non-empty string'}
    ${12}                 | ${true}  | ${'should return true for a non-empty number'}
    ${['item1', 'item2']} | ${true}  | ${'should return true for a non-empty array'}
  `('$description', ({ value, expected }) => {
    const result = hasAnswerValue(value);
    expect(result).toBe(expected);
  });
});

describe('getUpdatedValues', () => {
  test('should return values for a multiple selection item when answers are the same(skipped) and has not been edited before', () => {
    const prevItemIds: string[] = [];
    const updatedItemIds: string[] = [];

    const result = getUpdatedValues(
      [multiSelectWithoutAnswersNonEdited],
      multiSelectWithoutAnswersNonEdited,
      prevItemIds,
      updatedItemIds,
    );

    expect(result).toEqual({ edited: null, itemIds: ['item1'] });
  });

  test('should return values for a multiple selection item when answers are the same(skipped) and has been edited before', () => {
    const defaultValues = [{ itemId: 'item1', answers: [], edited: 1697703435095 }];
    const prevItemIds: string[] = ['item1'];
    const updatedItemIds: string[] = [];

    const result = getUpdatedValues(
      defaultValues,
      multiSelectWithoutAnswersNonEdited,
      prevItemIds,
      updatedItemIds,
    );

    expect(result).toEqual({ edited: 1697703435095, itemIds: ['item1'] });
  });

  test('should return values for a multiple selection item when answers are different and has not been edited before', () => {
    const currentItem = { itemId: 'item1', answers: ['1', '2', '3'], edited: null };
    const prevItemIds: string[] = [];
    const updatedItemIds: string[] = [];

    const result = getUpdatedValues(
      [multiSelectWithoutAnswersNonEdited],
      currentItem,
      prevItemIds,
      updatedItemIds,
    );

    expect(result).toEqual({ edited: null, itemIds: ['item1'] });
  });

  test('should return values for a multiple selection item when answers are different and has been edited before', () => {
    const defaultValues = [{ itemId: 'item1', answers: ['1'], edited: 1697703435095 }];
    const currentItem = { itemId: 'item1', answers: ['1', '2', '3'], edited: null };
    const prevItemIds: string[] = ['item1'];
    const updatedItemIds: string[] = [];

    const { edited, itemIds } = getUpdatedValues(
      defaultValues,
      currentItem,
      prevItemIds,
      updatedItemIds,
    );

    const editedDate = format(new Date(edited as number), DateFormats.MonthDayTime);
    const expectedDate = format(new Date(), DateFormats.MonthDayTime);

    expect(editedDate).toEqual(expectedDate);
    expect(itemIds).toEqual(['item1']);
  });

  test('should return values for a single selection/slider item when answers are the same(skipped) and has not been edited before', () => {
    const prevItemIds: string[] = [];
    const updatedItemIds: string[] = [];

    const result = getUpdatedValues(
      [singleSelectWithAnswersNonEdited],
      singleSelectWithAnswersNonEdited,
      prevItemIds,
      updatedItemIds,
    );

    expect(result).toEqual({ edited: null, itemIds: ['item1'] });
  });

  test('should return values for a single selection/slider item when answers are the same(skipped) and has been edited before', () => {
    const defaultValues = [{ itemId: 'item1', answers: 1, edited: 1697703435095 }];
    const prevItemIds: string[] = ['item1'];
    const updatedItemIds: string[] = [];

    const result = getUpdatedValues(
      defaultValues,
      singleSelectWithAnswersNonEdited,
      prevItemIds,
      updatedItemIds,
    );

    expect(result).toEqual({ edited: 1697703435095, itemIds: ['item1'] });
  });

  test('should return values for a single selection/slider item when answers are different and has been edited before', () => {
    const defaultValues = [{ itemId: 'item1', answers: 3, edited: null }];
    const prevItemIds: string[] = [];
    const updatedItemIds: string[] = [];

    const result = getUpdatedValues(
      defaultValues,
      singleSelectWithAnswersNonEdited,
      prevItemIds,
      updatedItemIds,
    );

    expect(result).toEqual({ edited: null, itemIds: ['item1'] });
  });

  test('should return values for a single selection/slider item when answers are different and has been edited before', () => {
    const defaultValues = [{ itemId: 'item1', answers: 3, edited: 1697703435095 }];
    const prevItemIds: string[] = ['item1'];
    const updatedItemIds: string[] = [];

    const { edited, itemIds } = getUpdatedValues(
      defaultValues,
      singleSelectWithAnswersNonEdited,
      prevItemIds,
      updatedItemIds,
    );

    const editedDate = format(new Date(edited as number), DateFormats.MonthDayTime);
    const expectedDate = format(new Date(), DateFormats.MonthDayTime);

    expect(editedDate).toEqual(expectedDate);
    expect(itemIds).toEqual(['item1']);
  });
});
