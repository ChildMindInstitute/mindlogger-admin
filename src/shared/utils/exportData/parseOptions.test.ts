import { ItemResponseType } from 'shared/consts';

import { parseOptions } from './parseOptions';

describe('parseOptions', () => {
  const single = {
    paletteName: null,
    options: [
      {
        id: 'b9a71359-467a-4bb8-84a5-6a8fe61da246',
        text: 'opt1',
        image: null,
        score: 4,
        tooltip: null,
        isHidden: false,
        color: null,
        alert: null,
        value: 1,
      },
      {
        id: '000394a5-2963-4f12-8b5f-e9340051512a',
        text: 'opt2',
        image: null,
        score: 2,
        tooltip: null,
        isHidden: false,
        color: null,
        alert: null,
        value: 2,
      },
    ],
  };
  const singleExpected = 'Opt1: 1 (score: 4), Opt2: 2 (score: 2)';
  const singleScoreWithoutValues = {
    paletteName: null,
    options: [
      {
        ...single.options[0],
        value: null,
      },
      {
        ...single.options[1],
        value: null,
      },
    ],
  };
  const singleScoreWithoutValuesExpected = 'Opt1 (score: 4), Opt2 (score: 2)';
  const singleWithoutScore = {
    paletteName: null,
    options: [
      {
        ...single.options[0],
        score: null,
      },
      {
        ...single.options[1],
        score: null,
      },
    ],
  };
  const singleWithoutScoreExpected = 'Opt1: 1, Opt2: 2';
  const singleWithoutValues = {
    paletteName: null,
    options: [
      {
        ...single.options[0],
        score: null,
        value: null,
      },
      {
        ...single.options[1],
        score: null,
        value: null,
      },
    ],
  };
  const singleWithoutValuesExpected = 'Opt1, Opt2';
  const multi = {
    paletteName: null,
    options: [
      {
        id: '19c1af9b-c9d1-4b33-819a-9eff33b6d300',
        text: 'opt1',
        image: null,
        score: 2,
        tooltip: null,
        isHidden: false,
        color: null,
        alert: null,
        value: 1,
      },
      {
        id: 'abf02196-916c-4b0c-84ae-0381d4a98cb9',
        text: 'opt2',
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
  const multiExpected = 'Opt1: 1 (score: 2), Opt2: 2 (score: 1)';
  const slider = {
    minLabel: 'min',
    maxLabel: 'max',
    minValue: 0,
    maxValue: 5,
    minImage: null,
    maxImage: null,
    scores: [1, 2, 3, 4, 5, 6],
    alerts: null,
  };
  const sliderExpected =
    '0: 0 (score: 1), 1: 1 (score: 2), 2: 2 (score: 3), 3: 3 (score: 4), 4: 4 (score: 5), 5: 5 (score: 6)';
  const sliderWithoutScore = {
    minLabel: 'min',
    maxLabel: 'max',
    minValue: 0,
    maxValue: 5,
    minImage: null,
    maxImage: null,
    scores: null,
    alerts: null,
  };
  const sliderWithoutScoreExpected = '0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5';
  const numberSelect = {
    minValue: 0,
    maxValue: 7,
  };
  const singleSelectRows = {
    rows: [
      {
        id: '52c21500-99db-4a65-a257-c2e54e7370d3',
        rowName: 'row1',
        rowImage: null,
        tooltip: null,
      },
    ],
    options: [
      {
        id: '8747ed38-f4b3-4fde-855e-20471ca0aa8e',
        text: 'opt1',
        image: null,
        tooltip: null,
      },
      {
        id: 'd79a44c2-78b6-4fdd-b6fa-8bf41d0b3760',
        text: 'opt1',
        image: null,
        tooltip: null,
      },
    ],
    dataMatrix: [
      {
        rowId: '52c21500-99db-4a65-a257-c2e54e7370d3',
        options: [
          {
            optionId: '8747ed38-f4b3-4fde-855e-20471ca0aa8e',
            score: 2,
            alert: null,
            value: 1,
          },
          {
            optionId: 'd79a44c2-78b6-4fdd-b6fa-8bf41d0b3760',
            score: 4,
            alert: null,
            value: 2,
          },
        ],
      },
    ],
  };
  const multiSelectRows = {
    rows: [
      {
        id: '1248a537-218e-4285-99ca-d435a79fea39',
        rowName: 'row1',
        rowImage: null,
        tooltip: null,
      },
    ],
    options: [
      {
        id: '95fdad7a-a94b-46ca-907c-5ef858df8535',
        text: 'opt1',
        image: null,
        tooltip: null,
      },
      {
        id: '6c1aa535-34f3-424f-bde4-40d937b0013b',
        text: 'opt1',
        image: null,
        tooltip: null,
      },
    ],
    dataMatrix: [
      {
        rowId: '1248a537-218e-4285-99ca-d435a79fea39',
        options: [
          {
            optionId: '95fdad7a-a94b-46ca-907c-5ef858df8535',
            score: 3,
            alert: null,
            value: 1,
          },
          {
            optionId: '6c1aa535-34f3-424f-bde4-40d937b0013b',
            score: 5,
            alert: null,
            value: 2,
          },
        ],
      },
    ],
  };
  const sliderRows = {
    rows: [
      {
        minLabel: 'min',
        maxLabel: 'max',
        minValue: 1,
        maxValue: 5,
        minImage: null,
        maxImage: null,
        scores: [1, 2, 3, 4, 5],
        alerts: null,
        id: '87ff7de0-3552-4a14-b748-d6bcb12f4d87',
        label: 'slider',
      },
    ],
  };
  const drawing = {
    drawingExample:
      'https://media-dev.cmiml.net/mindlogger/391962851007982489/91c9d624-3ab1-45ca-8f68-4cfc94cdd195/Transfer Ownership - 1.png',
    drawingBackground:
      'https://media-dev.cmiml.net/mindlogger/391962851007982489/3374a78e-0a46-4add-b89e-d5bff79e9678/Transfer Ownership - 1.png',
  };
  const audio = {
    maxDuration: 300,
  };
  const audioPlayer = {
    file: 'https://media-dev.cmiml.net/mindlogger/391962851007982489/b6d8573c-8174-41cb-b0fa-ad9fb0d237ff/t-rex-roar.mp3',
  };

  test.each`
    responseType                                | responseValues              | expected                            | description
    ${ItemResponseType.SingleSelection}         | ${single}                   | ${singleExpected}                   | ${'single'}
    ${ItemResponseType.SingleSelection}         | ${singleScoreWithoutValues} | ${singleScoreWithoutValuesExpected} | ${'single with score without values'}
    ${ItemResponseType.SingleSelection}         | ${singleWithoutScore}       | ${singleWithoutScoreExpected}       | ${'single with values without score'}
    ${ItemResponseType.SingleSelection}         | ${singleWithoutValues}      | ${singleWithoutValuesExpected}      | ${'single without values and scores'}
    ${ItemResponseType.MultipleSelection}       | ${multi}                    | ${multiExpected}                    | ${'multi'}
    ${ItemResponseType.Slider}                  | ${slider}                   | ${sliderExpected}                   | ${'slider'}
    ${ItemResponseType.Slider}                  | ${sliderWithoutScore}       | ${sliderWithoutScoreExpected}       | ${'slider without score'}
    ${ItemResponseType.Date}                    | ${null}                     | ${undefined}                        | ${'date'}
    ${ItemResponseType.NumberSelection}         | ${numberSelect}             | ${undefined}                        | ${'numberSelect'}
    ${ItemResponseType.Time}                    | ${null}                     | ${undefined}                        | ${'time'}
    ${ItemResponseType.TimeRange}               | ${null}                     | ${undefined}                        | ${'timeRange'}
    ${ItemResponseType.SingleSelectionPerRow}   | ${singleSelectRows}         | ${''}                               | ${'singleSelectRows'}
    ${ItemResponseType.MultipleSelectionPerRow} | ${multiSelectRows}          | ${''}                               | ${'multiSelectRows'}
    ${ItemResponseType.SliderRows}              | ${sliderRows}               | ${''}                               | ${'sliderRows'}
    ${ItemResponseType.Text}                    | ${null}                     | ${undefined}                        | ${'text'}
    ${ItemResponseType.Drawing}                 | ${drawing}                  | ${undefined}                        | ${'drawing'}
    ${ItemResponseType.Photo}                   | ${null}                     | ${undefined}                        | ${'photo'}
    ${ItemResponseType.Video}                   | ${null}                     | ${undefined}                        | ${'video'}
    ${ItemResponseType.Audio}                   | ${audio}                    | ${undefined}                        | ${'audio'}
    ${ItemResponseType.AudioPlayer}             | ${audioPlayer}              | ${undefined}                        | ${'audioPlayer'}
  `('returns content for options for "$description": "$expected"', ({ responseType, responseValues, expected }) => {
    expect(parseOptions(responseValues, responseType)).toBe(expected);
  });
});
