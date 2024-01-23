import { getDefaultSliderScores } from './getDefaultSliderScores';

describe('getDefaultSliderScores', () => {
  test.each`
    sliderValues                        | expected              | description
    ${{ minValue: -1, maxValue: 4 }}    | ${[0, 1, 2, 3, 4, 5]} | ${'returns an array of scores starting from a negative minValue up to a positive maxValue'}
    ${{ minValue: '3', maxValue: '7' }} | ${[4, 5, 6, 7, 8]}    | ${'returns an array of scores starting from a negative minValue up to a positive maxValue (where values are string)'}
    ${{ minValue: 4, maxValue: 5 }}     | ${[5, 6]}             | ${'returns an array of scores when minValue is less than maxValue'}
  `('$description', ({ sliderValues, expected }) => {
    expect(getDefaultSliderScores(sliderValues)).toEqual(expected);
  });
});
