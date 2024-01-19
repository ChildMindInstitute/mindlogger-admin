import { getDrawingLines } from './getDrawingLines';

const drawingLines = [
  {
    startTime: 1689770366939,
    points: [
      {
        time: 1689770366939,
        x: 8.22055156707117,
        y: 97.74436314505357,
      },
      {
        time: 1689770367141,
        x: 8.22055156707117,
        y: 97.51686568525957,
      },
      {
        time: 1689770367155,
        x: 8.22055156707117,
        y: 97.03883955430354,
      },
    ],
  },
  {
    startTime: 1689770388034,
    points: [
      {
        time: 1689770388034,
        x: 3.609022639201978,
        y: 2.205513835067875,
      },
      {
        time: 1689770388128,
        x: 4.00325086405094,
        y: 2.205513835067875,
      },
      {
        time: 1689770388145,
        x: 5.03298357511019,
        y: 2.205513835067875,
      },
      {
        time: 1689770388162,
        x: 6.088444364277798,
        y: 2.205513835067875,
      },
    ],
  },
  {
    startTime: 1689770395493,
    points: [
      {
        time: 1689770395493,
        x: 93.43358610378453,
        y: 0.6015037732003296,
      },
      {
        time: 1689770395594,
        x: 93.43358610378453,
        y: 0.8020050309337728,
      },
      {
        time: 1689770395613,
        x: 93.43358610378453,
        y: 1.7248688522347018,
      },
      {
        time: 1689770395628,
        x: 93.43358610378453,
        y: 2.8751444699504605,
      },
    ],
  },
  {
    startTime: 1689770401736,
    points: [
      {
        time: 1689770401736,
        x: 96.94235811411978,
        y: 93.53383673265125,
      },
      {
        time: 1689770401838,
        x: 96.24149705872111,
        y: 93.53383673265125,
      },
      {
        time: 1689770401854,
        x: 94.84529411706667,
        y: 93.53383673265125,
      },
    ],
  },
];
const regularResult = [
  {
    UTC_Timestamp: '1689770366.939',
    epoch_time_in_seconds_start: '1689770366.939',
    line_number: '0',
    seconds: '0',
    x: '2.270870598638445',
    y: '72.99879471131118',
  },
  {
    UTC_Timestamp: '1689770367.141',
    epoch_time_in_seconds_start: '',
    line_number: '0',
    seconds: '0.202',
    x: '2.270870598638445',
    y: '73.06163931346421',
  },
  {
    UTC_Timestamp: '1689770367.155',
    epoch_time_in_seconds_start: '',
    line_number: '0',
    seconds: '0.216',
    x: '2.270870598638445',
    y: '73.19369073085538',
  },
  {
    UTC_Timestamp: '1689770388.034',
    epoch_time_in_seconds_start: '',
    line_number: '1',
    seconds: '21.095',
    x: '0.9969675798900491',
    y: '99.39074203451163',
  },
  {
    UTC_Timestamp: '1689770388.128',
    epoch_time_in_seconds_start: '',
    line_number: '1',
    seconds: '21.189',
    x: '1.1058704044339613',
    y: '99.39074203451163',
  },
  {
    UTC_Timestamp: '1689770388.145',
    epoch_time_in_seconds_start: '',
    line_number: '1',
    seconds: '21.206',
    x: '1.390326954450329',
    y: '99.39074203451163',
  },
  {
    UTC_Timestamp: '1689770388.162',
    epoch_time_in_seconds_start: '',
    line_number: '1',
    seconds: '21.223',
    x: '1.6818907083640324',
    y: '99.39074203451163',
  },
  {
    UTC_Timestamp: '1689770395.493',
    epoch_time_in_seconds_start: '',
    line_number: '2',
    seconds: '28.554',
    x: '25.81038290159794',
    y: '99.833838736685',
  },
  {
    UTC_Timestamp: '1689770395.594',
    epoch_time_in_seconds_start: '',
    line_number: '2',
    seconds: '28.655',
    x: '25.81038290159794',
    y: '99.77845164891332',
  },
  {
    UTC_Timestamp: '1689770395.613',
    epoch_time_in_seconds_start: '',
    line_number: '2',
    seconds: '28.674',
    x: '25.81038290159794',
    y: '99.52351689164787',
  },
  {
    UTC_Timestamp: '1689770395.628',
    epoch_time_in_seconds_start: '',
    line_number: '2',
    seconds: '28.689',
    x: '25.81038290159794',
    y: '99.20576119614628',
  },
  {
    UTC_Timestamp: '1689770401.736',
    epoch_time_in_seconds_start: '',
    line_number: '3',
    seconds: '34.797',
    x: '26.779656937602148',
    y: '74.16192355451622',
  },
  {
    UTC_Timestamp: '1689770401.838',
    epoch_time_in_seconds_start: '',
    line_number: '3',
    seconds: '34.899',
    x: '26.586048911248927',
    y: '74.16192355451622',
  },
  {
    UTC_Timestamp: '1689770401.854',
    epoch_time_in_seconds_start: '',
    line_number: '3',
    seconds: '34.915',
    x: '26.20035749090239',
    y: '74.16192355451622',
  },
];

describe('getDrawingLines', () => {
  test.each`
    lines           | width  | expected         | description
    ${drawingLines} | ${362} | ${regularResult} | ${'should generate records for width = 300'}
    ${drawingLines} | ${0}   | ${[]}            | ${'should return empty array for width = 0'}
  `('$description', ({ lines, width, expected }) => {
    expect(getDrawingLines(lines, width)).toEqual(expected);
  });
});
