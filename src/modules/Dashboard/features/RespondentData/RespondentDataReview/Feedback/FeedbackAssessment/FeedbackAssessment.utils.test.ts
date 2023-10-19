import { formatToNumberArray, hasAnswerValue, getUpdatedValues } from './FeedbackAssessment.utils';

describe('formatToNumberArray', () => {
  it('should return an empty array when the input array is empty', () => {
    const result = formatToNumberArray([]);
    expect(result).toEqual([]);
  });

  it('should convert an array of strings to an array of numbers', () => {
    const stringArray = ['1', '2', '3', '4'];
    const result = formatToNumberArray(stringArray);
    expect(result).toEqual([1, 2, 3, 4]);
  });
});

describe('hasAnswerValue', () => {
  it('should return false for an empty string', () => {
    const result = hasAnswerValue('');
    expect(result).toBe(false);
  });

  it('should return false for an empty array', () => {
    const result = hasAnswerValue([]);
    expect(result).toBe(false);
  });

  it('should return true for a non-empty string', () => {
    const result = hasAnswerValue('Hello World!');
    expect(result).toBe(true);
  });

  it('should return true for a non-empty number', () => {
    const result = hasAnswerValue(12);
    expect(result).toBe(true);
  });

  it('should return true for a non-empty array', () => {
    const result = hasAnswerValue(['item1', 'item2']);
    expect(result).toBe(true);
  });
});

describe('getUpdatedValues', () => {
  it('should return values for a multiple selection item when answers are the same(skipped) and has not been edited before', () => {
    const defaultValues = [{ itemId: 'item1', answers: [], edited: null }];
    const currentItem = { itemId: 'item1', answers: [], edited: null };
    const prevItemIds: string[] = [];
    const updatedItemIds: string[] = [];

    const result = getUpdatedValues(defaultValues, currentItem, prevItemIds, updatedItemIds);

    expect(result).toEqual({ edited: null, itemIds: ['item1'] });
  });

  it('should return values for a multiple selection item when answers are the same(skipped) and has been edited before', () => {
    const defaultValues = [{ itemId: 'item1', answers: [], edited: 1697703435095 }];
    const currentItem = { itemId: 'item1', answers: [], edited: null };
    const prevItemIds: string[] = ['item1'];
    const updatedItemIds: string[] = [];

    const result = getUpdatedValues(defaultValues, currentItem, prevItemIds, updatedItemIds);

    expect(result).toEqual({ edited: 1697703435095, itemIds: ['item1'] });
  });

  it('should return values for a multiple selection item when answers are different and has not been edited before', () => {
    const defaultValues = [{ itemId: 'item1', answers: [], edited: null }];
    const currentItem = { itemId: 'item1', answers: ['1', '2', '3'], edited: null };
    const prevItemIds: string[] = [];
    const updatedItemIds: string[] = [];

    const result = getUpdatedValues(defaultValues, currentItem, prevItemIds, updatedItemIds);

    expect(result).toEqual({ edited: null, itemIds: ['item1'] });
  });

  it('should return values for a multiple selection item when answers are different and has been edited before', () => {
    const defaultValues = [{ itemId: 'item1', answers: ['1'], edited: 1697703435095 }];
    const currentItem = { itemId: 'item1', answers: ['1', '2', '3'], edited: null };
    const prevItemIds: string[] = ['item1'];
    const updatedItemIds: string[] = [];

    const result = getUpdatedValues(defaultValues, currentItem, prevItemIds, updatedItemIds);

    expect(result).toEqual({ edited: new Date().getTime(), itemIds: ['item1'] });
  });

  it('should return values for a single selection/slider item when answers are the same(skipped) and has not been edited before', () => {
    const defaultValues = [{ itemId: 'item1', answers: 1, edited: null }];
    const currentItem = { itemId: 'item1', answers: 1, edited: null };
    const prevItemIds: string[] = [];
    const updatedItemIds: string[] = [];

    const result = getUpdatedValues(defaultValues, currentItem, prevItemIds, updatedItemIds);

    expect(result).toEqual({ edited: null, itemIds: ['item1'] });
  });

  it('should return values for a single selection/slider item when answers are the same(skipped) and has been edited before', () => {
    const defaultValues = [{ itemId: 'item1', answers: 1, edited: 1697703435095 }];
    const currentItem = { itemId: 'item1', answers: 1, edited: null };
    const prevItemIds: string[] = ['item1'];
    const updatedItemIds: string[] = [];

    const result = getUpdatedValues(defaultValues, currentItem, prevItemIds, updatedItemIds);

    expect(result).toEqual({ edited: 1697703435095, itemIds: ['item1'] });
  });

  it('should return values for a single selection/slider item when answers are different and has been edited before', () => {
    const defaultValues = [{ itemId: 'item1', answers: 1, edited: null }];
    const currentItem = { itemId: 'item1', answers: 3, edited: null };
    const prevItemIds: string[] = [];
    const updatedItemIds: string[] = [];

    const result = getUpdatedValues(defaultValues, currentItem, prevItemIds, updatedItemIds);

    expect(result).toEqual({ edited: null, itemIds: ['item1'] });
  });

  it('should return values for a single selection/slider item when answers are different and has been edited before', () => {
    const defaultValues = [{ itemId: 'item1', answers: 1, edited: 1697703435095 }];
    const currentItem = { itemId: 'item1', answers: 3, edited: null };
    const prevItemIds: string[] = ['item1'];
    const updatedItemIds: string[] = [];

    const result = getUpdatedValues(defaultValues, currentItem, prevItemIds, updatedItemIds);

    expect(result).toEqual({ edited: new Date().getTime(), itemIds: ['item1'] });
  });
});
