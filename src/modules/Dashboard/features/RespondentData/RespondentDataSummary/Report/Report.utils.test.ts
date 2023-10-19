import { ItemResponseType } from 'shared/consts';

import { getDateISO, getSliderOptions, isAnswerTypeCorrect, isValueDefined } from './Report.utils';

describe('isValueDefined', () => {
  it('should return true for a defined string value', () => {
    const result = isValueDefined('Hello');
    expect(result).toBe(true);
  });

  it('should return true for a defined number value', () => {
    const result = isValueDefined(42);
    expect(result).toBe(true);
  });

  it('should return true for an array of defined string values', () => {
    const result = isValueDefined(['Value1', 'Value2']);
    expect(result).toBe(true);
  });

  it('should return true for an array of defined number values', () => {
    const result = isValueDefined([1, 2, 3]);
    expect(result).toBe(true);
  });

  it('should return true for an empty string', () => {
    const result = isValueDefined('');
    expect(result).toBe(true);
  });

  it('should return true for an empty array', () => {
    const result = isValueDefined([]);
    expect(result).toBe(true);
  });

  it('should return true for zero', () => {
    const result = isValueDefined(0);
    expect(result).toBe(true);
  });

  it('should return false for null', () => {
    const result = isValueDefined(null);
    expect(result).toBe(false);
  });

  it('should return false for undefined', () => {
    const result = isValueDefined(undefined);
    expect(result).toBe(false);
  });
});

describe('isAnswerTypeCorrect', () => {
  it('should return true for a correct single selection/slider answer', () => {
    const answer = { value: 3 };
    const result = isAnswerTypeCorrect(answer, ItemResponseType.SingleSelection);
    expect(result).toBe(true);
  });

  it('should return false for an incorrect single selection/slider answer', () => {
    const answer = { value: 'string' };
    const result = isAnswerTypeCorrect(answer, ItemResponseType.SingleSelection);
    expect(result).toBe(false);
  });

  it('should return true for a correct multiple selection answer', () => {
    const answer = { value: [1, 2, 3] };
    const result = isAnswerTypeCorrect(answer, ItemResponseType.MultipleSelection);
    expect(result).toBe(true);
  });

  it('should return false for an incorrect multiple selection answer', () => {
    const answer = { value: 'string' };
    const result = isAnswerTypeCorrect(answer, ItemResponseType.MultipleSelection);
    expect(result).toBe(false);
  });

  it('should return true for a correct text answer', () => {
    const answer = 'string';
    const result = isAnswerTypeCorrect(answer, ItemResponseType.Text);
    expect(result).toBe(true);
  });

  it('should return false for an incorrect text answer', () => {
    const answer = { value: 'string' };
    const result = isAnswerTypeCorrect(answer, ItemResponseType.Text);
    expect(result).toBe(false);
  });
});

describe('getDateISO', () => {
  it('should format a date and time to ISO string', () => {
    const date = new Date('2023-10-19T12:30:00Z');
    const time = '15:45';

    const result = getDateISO(date, time);

    expect(result).toBe('2023-10-19T15:45:00');
  });

  it('should handle a date and time with single-digit hours and minutes', () => {
    const date = new Date('2023-10-19T12:35:00Z');
    const time = '5:5';

    const result = getDateISO(date, time);

    expect(result).toBe('2023-10-19T05:05:00');
  });
});

describe('getSliderOptions', () => {
  it('should create slider options [0, 5]', () => {
    const minValue = 0;
    const maxValue = 5;
    const itemId = 'slider1';

    const result = getSliderOptions({ minValue, maxValue }, itemId);

    expect(result).toEqual([
      { id: 'slider1-0', text: 0, value: 0 },
      { id: 'slider1-1', text: 1, value: 1 },
      { id: 'slider1-2', text: 2, value: 2 },
      { id: 'slider1-3', text: 3, value: 3 },
      { id: 'slider1-4', text: 4, value: 4 },
      { id: 'slider1-5', text: 5, value: 5 },
    ]);
  });

  it('should create slider options for a single value', () => {
    const minValue = 1;
    const maxValue = 1;
    const itemId = 'slider1';

    const result = getSliderOptions({ minValue, maxValue }, itemId);

    expect(result).toEqual([{ id: 'slider1-1', text: 1, value: 1 }]);
  });
});
