import { getRawScores } from './getRawScores';

const singleResponseValues = {
  paletteName: null,
  options: [
    {
      id: '4bae594b-4385-402c-aa96-0f6438e7e642',
      text: 'opt1',
      image: null,
      score: 3,
      tooltip: null,
      isHidden: false,
      color: null,
      alert: null,
      value: 0,
    },
    {
      id: 'b8b0a211-7f30-48af-bee5-54cbf53889bd',
      text: 'opt2',
      image: null,
      score: 5,
      tooltip: null,
      isHidden: false,
      color: null,
      alert: null,
      value: 1,
    },
    {
      id: '3c75fa7f-3ae9-4b4f-ab29-81664418c430',
      text: 'opt3',
      image: null,
      score: 1,
      tooltip: null,
      isHidden: false,
      color: null,
      alert: null,
      value: 2,
    },
  ],
};
const multiResponseValues = {
  paletteName: null,
  options: [
    {
      id: 'e6f6b1c1-3ec2-45b2-8c34-6d0970b86d64',
      text: 'opt1',
      image: null,
      score: 1,
      tooltip: null,
      isHidden: false,
      color: null,
      alert: null,
      value: 0,
    },
    {
      id: 'a64abb45-1ba3-4113-88b1-5e28459755dc',
      text: 'opt2',
      image: null,
      score: 3,
      tooltip: null,
      isHidden: false,
      color: null,
      alert: null,
      value: 1,
    },
    {
      id: '1ce9e52d-28b3-4768-846c-83e378db59ef',
      text: 'opt3',
      image: null,
      score: 0,
      tooltip: null,
      isHidden: false,
      color: null,
      alert: null,
      value: 2,
    },
  ],
};
const sliderResponseValues = {
  minLabel: 'min',
  maxLabel: 'max',
  minValue: 0,
  maxValue: 5,
  minImage: null,
  maxImage: null,
  scores: [1, 2, 3, 4, 5, 6],
  alerts: null,
};

describe('getRawScores', () => {
  test.each`
    responseValues          | expected | description
    ${singleResponseValues} | ${9}     | ${'should return raw scores for single item'}
    ${multiResponseValues}  | ${4}     | ${'should return raw scores for multi item'}
    ${sliderResponseValues} | ${21}    | ${'should return raw scores for slider item'}
  `('$description', ({ responseValues, expected }) => {
    expect(getRawScores(responseValues)).toBe(expected);
  });
});
