import { createArrayForSlider } from './RespondentData.utils';

jest.mock('shared/utils', () => ({
  ...jest.requireActual('shared/utils'),
}));

describe('createArrayForSlider', () => {
  test('should create an array with the correct length', () => {
    const result = createArrayForSlider({ maxValue: 5, minValue: 1 });
    expect(result).toHaveLength(5);
  });

  test('should create an array with the correct values and labels', () => {
    const result = createArrayForSlider({ maxValue: 3, minValue: 0 });
    expect(result).toEqual([
      { value: 0, label: 0 },
      { value: 1, label: 1 },
      { value: 2, label: 2 },
      { value: 3, label: 3 },
    ]);
  });

  test('should create an array with a single element when minValue and maxValue are the same', () => {
    const result = createArrayForSlider({ maxValue: 2, minValue: 2 });
    expect(result).toEqual([{ value: 2, label: 2 }]);
  });
});
