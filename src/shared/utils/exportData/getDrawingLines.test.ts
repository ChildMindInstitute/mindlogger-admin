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
    x: '8.22055156707117',
    y: '2.255636854946431',
  },
  {
    UTC_Timestamp: '1689770367.141',
    epoch_time_in_seconds_start: '',
    line_number: '0',
    seconds: '0.202',
    x: '8.22055156707117',
    y: '2.4831343147404255',
  },
  {
    UTC_Timestamp: '1689770367.155',
    epoch_time_in_seconds_start: '',
    line_number: '0',
    seconds: '0.216',
    x: '8.22055156707117',
    y: '2.961160445696464',
  },
  {
    UTC_Timestamp: '1689770388.034',
    epoch_time_in_seconds_start: '',
    line_number: '1',
    seconds: '21.095',
    x: '3.609022639201978',
    y: '97.79448616493212',
  },
  {
    UTC_Timestamp: '1689770388.128',
    epoch_time_in_seconds_start: '',
    line_number: '1',
    seconds: '21.189',
    x: '4.00325086405094',
    y: '97.79448616493212',
  },
  {
    UTC_Timestamp: '1689770388.145',
    epoch_time_in_seconds_start: '',
    line_number: '1',
    seconds: '21.206',
    x: '5.03298357511019',
    y: '97.79448616493212',
  },
  {
    UTC_Timestamp: '1689770388.162',
    epoch_time_in_seconds_start: '',
    line_number: '1',
    seconds: '21.223',
    x: '6.088444364277798',
    y: '97.79448616493212',
  },
  {
    UTC_Timestamp: '1689770395.493',
    epoch_time_in_seconds_start: '',
    line_number: '2',
    seconds: '28.554',
    x: '93.43358610378453',
    y: '99.39849622679967',
  },
  {
    UTC_Timestamp: '1689770395.594',
    epoch_time_in_seconds_start: '',
    line_number: '2',
    seconds: '28.655',
    x: '93.43358610378453',
    y: '99.19799496906623',
  },
  {
    UTC_Timestamp: '1689770395.613',
    epoch_time_in_seconds_start: '',
    line_number: '2',
    seconds: '28.674',
    x: '93.43358610378453',
    y: '98.2751311477653',
  },
  {
    UTC_Timestamp: '1689770395.628',
    epoch_time_in_seconds_start: '',
    line_number: '2',
    seconds: '28.689',
    x: '93.43358610378453',
    y: '97.12485553004954',
  },
  {
    UTC_Timestamp: '1689770401.736',
    epoch_time_in_seconds_start: '',
    line_number: '3',
    seconds: '34.797',
    x: '96.94235811411978',
    y: '6.4661632673487475',
  },
  {
    UTC_Timestamp: '1689770401.838',
    epoch_time_in_seconds_start: '',
    line_number: '3',
    seconds: '34.899',
    x: '96.24149705872111',
    y: '6.4661632673487475',
  },
  {
    UTC_Timestamp: '1689770401.854',
    epoch_time_in_seconds_start: '',
    line_number: '3',
    seconds: '34.915',
    x: '94.84529411706667',
    y: '6.4661632673487475',
  },
];

describe('getDrawingLines', () => {
  test.each`
    lines           | width  | expected         | description
    ${drawingLines} | ${362} | ${regularResult} | ${'should generate records for width != 0'}
    ${drawingLines} | ${0}   | ${[]}            | ${'should return empty array for width = 0'}
  `('$description', ({ lines, width, expected }) => {
    expect(getDrawingLines(lines, width)).toEqual(expected);
  });
});
