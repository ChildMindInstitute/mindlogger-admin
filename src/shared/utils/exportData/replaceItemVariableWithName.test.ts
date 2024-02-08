import {
  mockedAudioActivityItem,
  mockedAudioPlayerActivityItem,
  mockedDateActivityItem,
  mockedDrawingActivityItem,
  mockedMessageActivityItem,
  mockedMultiActivityItem,
  mockedMultiSelectRowsActivityItem,
  mockedNumberSelectActivityItem,
  mockedPhotoActivityItem,
  mockedSingleActivityItem,
  mockedSingleSelectRowsActivityItem,
  mockedSliderActivityItem,
  mockedSliderRowsActivityItem,
  mockedTextActivityItem,
  mockedTimeRangeActivityItem,
  mockedTimeActivityItem,
  mockedVideoActivityItem,
} from 'shared/mock';

import { replaceItemVariableWithName } from './replaceItemVariableWithName';
import { mockedExportContextItemData } from '../../mock';

const items = [
  mockedSingleActivityItem,
  mockedMultiActivityItem,
  mockedSliderActivityItem,
  mockedDateActivityItem,
  mockedNumberSelectActivityItem,
  mockedTimeActivityItem,
  mockedTimeRangeActivityItem,
  mockedSingleSelectRowsActivityItem,
  mockedMultiSelectRowsActivityItem,
  mockedSliderRowsActivityItem,
  mockedTextActivityItem,
  mockedDrawingActivityItem,
  mockedPhotoActivityItem,
  mockedVideoActivityItem,
  mockedAudioActivityItem,
  mockedMessageActivityItem,
  mockedAudioPlayerActivityItem,
  {
    question: 'text_last',
    responseType: 'text',
    responseValues: null,
    config: {
      removeBackButton: false,
      skippableItem: false,
      maxResponseLength: 300,
      correctAnswerRequired: false,
      correctAnswer: '',
      numericalResponseRequired: false,
      responseDataIdentifier: false,
      responseRequired: false,
      isIdentifier: null,
    },
    name: 'text_last',
    isHidden: false,
    conditionalLogic: null,
    allowEdit: true,
    id: 'bff0d9a9-ed3b-4574-aaae-678f63fb9f22',
  },
];
const rawAnswersObject = {
  single_text_score: {
    activityItem: mockedSingleActivityItem,
    answer: {
      value: 2,
      text: 'Extra info',
    },
    items,
    ...mockedExportContextItemData,
  },
  multi_text_score: {
    activityItem: mockedMultiActivityItem,
    answer: {
      value: [1, 2],
      text: 'Extra info',
    },
    items,
    ...mockedExportContextItemData,
  },
  slider_text_score: {
    activityItem: mockedSliderActivityItem,
    answer: {
      value: 2,
      text: 'Extra info',
    },
    items,
    ...mockedExportContextItemData,
  },
  date_text: {
    activityItem: mockedDateActivityItem,
    answer: {
      value: {
        day: 16,
        month: 7,
        year: 2023,
      },
      text: 'Extra info',
    },
    items,
    ...mockedExportContextItemData,
  },
  number_selection_text: {
    activityItem: mockedNumberSelectActivityItem,
    answer: {
      value: '3',
      text: 'Extra info',
    },
    items,
    ...mockedExportContextItemData,
  },
  time_text: {
    activityItem: mockedTimeActivityItem,
    answer: {
      value: {
        minutes: 50,
        hours: 9,
      },
      text: 'Extra info',
    },
    items,
    ...mockedExportContextItemData,
  },
  time_range_text: {
    activityItem: mockedTimeRangeActivityItem,
    answer: {
      value: {
        from: {
          hour: 10,
          minute: 10,
        },
        to: {
          hour: 12,
          minute: 30,
        },
      },
      text: 'Extra info',
    },
    items,
    ...mockedExportContextItemData,
  },
  single_row_score: {
    activityItem: {
      question: 'single_row_score [[time_range_text]]',
      responseType: 'singleSelectRows',
      responseValues: {
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
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        timer: 0,
        addScores: true,
        setAlerts: false,
        addTooltip: false,
        addTokens: null,
      },
      name: 'single_row_score',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: '7daf4dce-d323-4c64-9e13-e843283fa280',
    },
    answer: {
      value: ['opt1'],
    },
    items,
    ...mockedExportContextItemData,
  },
  multi_row_score: {
    activityItem: mockedMultiSelectRowsActivityItem,
    answer: {
      value: [['opt1']],
    },
    items,
    ...mockedExportContextItemData,
  },
  slider_row_score: {
    activityItem: mockedSliderRowsActivityItem,
    answer: {
      value: [4],
    },
    items,
    ...mockedExportContextItemData,
  },
  text: {
    activityItem: mockedTextActivityItem,
    answer: 'Text',
    items,
    ...mockedExportContextItemData,
  },
  drawing_text: {
    activityItem: mockedDrawingActivityItem,
    answer: {
      value: {
        svgString:
          '<svg height="100" width="100" preserveAspectRatio="xMidYMid meet">\n<polyline points="19.64912325787743,57.844612856098365 21.967171238502093,51.79789191143199 27.30522046323436,41.38746619480218 32.50675285565185,31.3326719967492 36.74002595462715,24.087960932175736 40.234819537127564,19.525455932436437 42.70433260973018,17.145292823702615 43.75691526232838,16.29155323056986 44.06015138692414,16.09022593310882 44.01002607249078,17.77308913549183 42.848497958041264,24.27949201034872 41.029023081745116,34.11905084945298 39.762584862483926,45.418589015995245 39.79949966008848,58.1317809782891 39.79949966008848,67.0017955732638 40.821200664500005,71.39209270564318 41.784405818571834,73.05059691428117 43.45367913773262,72.67209939228181 46.849020596436326,68.08371181441102 50.84970232396411,60.08732907297225 54.998722430130556,51.60656887289411 59.97842644281051,42.39186931543648 64.78837011324936,34.29394487563081 68.51372362134867,29.21436348166475 71.12703185408816,26.61704370676394 73.02115930591462,25.80184651543975 73.6583112824705,27.355027599402273 73.68421221704037,34.609375794131076 73.68421221704037,44.23667913611878 73.68421221704037,52.06149036672852 73.9286159565926,57.4691992157487 76.26381802889375,59.82944558882815 80.76697666331455,58.02438357607543 86.68479869759845,50.20189749432857 91.54555298950393,43.040916264069814 92.13032792851715,42.2055147528898" fill="none" stroke="black" stroke-width="0.6"></polyline>\n<polyline points="24.360902814613347,84.81203202124647 26.84343366144167,84.81203202124647 32.60442134551821,84.67014899010869 39.79128821331485,83.77501562840395 47.2386727141647,83.12364353090774 55.388766151877945,82.69356441702931 64.33089095566578,82.70676881504532 73.31059138884025,82.70676881504532 81.5723286848483,82.66103680820024 86.31579145424729,82.40601692844517" fill="none" stroke="black" stroke-width="0.6"></polyline>\n</svg>',
        width: 362.7272644042969,
        fileName: 'ebc231b0-4a1c-4717-99de-0504b04d0e25.svg',
        type: 'image/svg',
        uri: 'https://media-dev.cmiml.net/mindlogger/2048412251058983019/2bf44ce6-4f2a-4cc4-8c66-2e8c256bc921/ebc231b0-4a1c-4717-99de-0504b04d0e25.svg',
        lines: [], // coordinates
      },
    },
    items,
    ...mockedExportContextItemData,
  },
  photo_text: {
    activityItem: mockedPhotoActivityItem,
    answer: {
      value:
        'https://media-dev.cmiml.net/mindlogger/2048412251058983019/d595acfc-8322-4d45-8ba5-c2f793b5476e/rn_image_picker_lib_temp_46ecc18c-2c7d-4d72-8d27-636c37e2e6f3.jpg',
    },
    items,
    ...mockedExportContextItemData,
  },
  video_text: {
    activityItem: mockedVideoActivityItem,
    answer: {
      value:
        'https://media-dev.cmiml.net/mindlogger/2048412251058983019/4fc51edd-2dab-4048-836b-f1b9bf0270f6/rn_image_picker_lib_temp_9309b1eb-90b0-4908-a24d-be6fa06def10.mp4',
    },
    items,
    ...mockedExportContextItemData,
  },
  audio_text: {
    activityItem: mockedAudioActivityItem,
    answer: {
      value:
        'https://media-dev.cmiml.net/mindlogger/2048412251058983019/73ef3a61-8053-4558-814e-05baafbbdc90/f01c225c-62df-4867-b282-66f585a65109.m4a',
    },
    items,
    ...mockedExportContextItemData,
  },
  message: {
    activityItem: mockedMessageActivityItem,
    answer: null,
    items,
    ...mockedExportContextItemData,
  },
  audio_player_text: {
    activityItem: mockedAudioPlayerActivityItem,
    answer: {
      value: true,
      text: 'Extra info',
    },
    items,
    ...mockedExportContextItemData,
  },
  text_last: {
    activityItem: {
      question: 'text_last',
      responseType: 'text',
      responseValues: null,
      config: {
        removeBackButton: false,
        skippableItem: false,
        maxResponseLength: 300,
        correctAnswerRequired: false,
        correctAnswer: '',
        numericalResponseRequired: false,
        responseDataIdentifier: false,
        responseRequired: false,
        isIdentifier: null,
      },
      name: 'text_last',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: 'bff0d9a9-ed3b-4574-aaae-678f63fb9f22',
    },
    answer: 'Text on last item',
    items,
    ...mockedExportContextItemData,
  },
};

describe('replaceItemVariableWithName', () => {
  test.each`
    markdown                                  | expected                               | description
    ${'single [[text_last]]'}                 | ${'single Text on last item'}          | ${'"text" variable in "single" question'}
    ${'multi [[single_text_score]]'}          | ${'multi opt2 '}                       | ${'"single" variable in "multi" question'}
    ${'slider [[multi_text_score]]'}          | ${'slider opt1, opt2 '}                | ${'"multi" variable in "slider" question'}
    ${'slider [[date_text]] '}                | ${'slider 2023-07-16  '}               | ${'"date" variable in "slider" question'}
    ${'date [[slider_text_score]] '}          | ${'date 2  '}                          | ${'"slider" variable in "date" question'}
    ${'number_selection_text [[date_text]]'}  | ${'number_selection_text 2023-07-16 '} | ${'"date" variable in "numberSelect" question'}
    ${'time_text [[number_selection_text]]'}  | ${'time_text 3 '}                      | ${'"numberSelect" variable in "time" question'}
    ${'time_range_text [[time_text]]'}        | ${'time_range_text  '}                 | ${'"time" variable in "timeRange" question'}
    ${'single_row_score [[time_range_text]]'} | ${'single_row_score 10:10 - 12:30 '}   | ${'"time_range" variable in "singleSelectRows" question'}
    ${'multi_row_score [[single_row_score]]'} | ${'multi_row_score  '}                 | ${'"single_row" variable in "multiSelectRows" question'}
    ${'slider_row_score [[multi_row_score]]'} | ${'slider_row_score  '}                | ${'"multi_row" variable in "sliderRows" question'}
    ${'text [[slider_row_score]]'}            | ${'text  '}                            | ${'"slider_row" variable in "text" question'}
    ${'drawing_text [[text]]'}                | ${'drawing_text Text'}                 | ${'"text" variable in "text" variable in "drawing" question'}
    ${'photo_text [[drawing_text]]'}          | ${'photo_text  '}                      | ${'"drawing" variable in "photo" question'}
    ${'video_text [[photo_text]]'}            | ${'video_text  '}                      | ${'"photo" variable in "video" question'}
    ${'audio_text [[video_text]]'}            | ${'audio_text  '}                      | ${'"video" variable in "audio" question'}
    ${'audio_player_text [[audio_text]]'}     | ${'audio_player_text  '}               | ${'"audio" variable in "audioPlayer" question'}
    ${'text_last [[audio_player_text]]'}      | ${'text_last  '}                       | ${'"audio_player" variable in "text" question'}
  `('returns parsed content for "$markdown" for $description item: "$expected"', ({ markdown, expected }) => {
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    expect(replaceItemVariableWithName({ markdown, items, rawAnswersObject })).toBe(expected);
  });
});
