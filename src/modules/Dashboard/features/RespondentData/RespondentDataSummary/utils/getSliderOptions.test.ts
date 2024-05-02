import { getSliderOptions } from './getSliderOptions';

describe('Respondent Data Summary: getSliderOptions', () => {
  const expectedOptions1 = [
    { id: 'slider1-0', text: 0, value: 0 },
    { id: 'slider1-1', text: 1, value: 1 },
    { id: 'slider1-2', text: 2, value: 2 },
    { id: 'slider1-3', text: 3, value: 3 },
  ];
  const expectedOptions2 = [{ id: 'slider2-1', text: 1, value: 1 }];

  test.each`
    minValue | maxValue | itemId       | expectedOptions     | description
    ${0}     | ${3}     | ${'slider1'} | ${expectedOptions1} | ${'should create slider options [0, 3]'}
    ${1}     | ${1}     | ${'slider2'} | ${expectedOptions2} | ${'should create slider options for a single value'}
  `('$description', ({ minValue, maxValue, itemId, expectedOptions }) => {
    const result = getSliderOptions({ minValue, maxValue }, itemId);
    expect(result).toEqual(expectedOptions);
  });
});
