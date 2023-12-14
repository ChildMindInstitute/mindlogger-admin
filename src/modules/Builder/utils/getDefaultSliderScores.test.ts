import { getDefaultSliderScores } from './getDefaultSliderScores';

describe('getDefaultSliderScores', () => {
  test.each`
    sliderValues                        | expected              | description
    ${{ minValue: -1, maxValue: 4 }}    | ${[1, 2, 3, 4, 5, 6]} | ${'returns an array of scores starting from a negative minValue up to a positive maxValue'}
    ${{ minValue: '3', maxValue: '7' }} | ${[1, 2, 3, 4, 5]}    | ${'returns an array of scores starting from a negative minValue up to a positive maxValue (where values are string)'}
    ${{ minValue: 7, maxValue: 3 }}     | ${[]}                 | ${'returns an empty array when minValue is greater than maxValue'}
    ${{ minValue: 5, maxValue: 5 }}     | ${[1]}                | ${'returns an array of scores when minValue is equal to maxValue'}
  `('$description', ({ sliderValues, expected }) => {
    expect(getDefaultSliderScores(sliderValues)).toEqual(expected);
  });
});
