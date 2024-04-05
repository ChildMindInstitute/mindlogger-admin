import {
  isNullAnswer,
  isTextAnswer,
  parseResponseValue,
} from 'shared/utils/exportData/parseResponseValue';
import { DecryptedAnswerData, ExtendedExportAnswerWithoutEncryption } from 'shared/types';
import { ItemResponseType } from 'shared/consts';

describe('parseResponseValue', () => {
  describe('regular items', () => {
    const mockedSharedDecryptedAnswerData = {
      id: '3cf61844-e5d0-40bd-a1b6-f2d3220f68e3',
      submitId: 'faa781d7-0ea9-48a4-9e4c-08a32853ef2e',
      version: '1.0.5',
      respondentId: '835e5277-5949-4dff-817a-d85c17a3604f',
      respondentSecretId: 'respondentSecretId',
      legacyProfileId: null,
      scheduledDatetime: null,
      startDatetime: 1686925181,
      endDatetime: 1686925280,
      migratedDate: null,
      appletHistoryId: '35f5085a-9972-449c-98e2-5a7637a1a7d7_1.0.5',
      activityHistoryId: 'f21a80cb-c5a2-442b-a6b1-37af779908c7_1.0.5',
      flowHistoryId: 'b4239819-42d3-4acd-8df8-475602478710_1.0.5',
      flowName: 'Activity Flow#1',
      reviewedAnswerId: null,
      createdAt: '2023-06-16T14:21:35.438048',
      appletId: '35f5085a-9972-449c-98e2-5a7637a1a7d7',
      activityId: 'f21a80cb-c5a2-442b-a6b1-37af779908c7',
      flowId: 'b4239819-42d3-4acd-8df8-475602478710',
      items: [], // items
      activityName: 'New Activity#1',
      subscaleSetting: {
        calculateTotalScore: null,
        subscales: [],
        totalScoresTableData: [],
      },
    };

    const single = {
      question: 'single',
      responseType: ItemResponseType.SingleSelection,
      responseValues: {
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
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        randomizeOptions: false,
        timer: 0,
        addScores: true,
        setAlerts: false,
        addTooltip: false,
        setPalette: false,
        addTokens: null,
        additionalResponseOption: {
          textInputOption: true,
          textInputRequired: false,
        },
      },
      name: 'single_text_score',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: '59cdc2ab-6c91-4edf-9133-7bfa9333f97c',
    };
    const singleAnswer = {
      value: 1,
    };
    const singleWithEditionAnswer = {
      value: 2,
      edited: 'time of edition',
    };
    const singleWithAdditionalTextAnswer = {
      value: 4,
      text: 'description for answer',
    };
    const singleWithAdditionalTextWithNoAnswer = {
      text: 'single selection description',
    };
    const singleWithAdditionalTextAndWrongOrderAnswer = {
      text: 'single selection description',
      value: 7,
    };
    const multi = {
      question: 'multi',
      responseType: 'multiSelect',
      responseValues: {
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
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        randomizeOptions: false,
        timer: 0,
        addScores: true,
        setAlerts: false,
        addTooltip: false,
        setPalette: false,
        addTokens: null,
        additionalResponseOption: {
          textInputOption: true,
          textInputRequired: false,
        },
      },
      name: 'multi_text_score',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: 'e7f80ed3-747d-4c82-a7c5-1c82c9dab601',
    };
    const multiAnswer = {
      value: [1],
    };
    const slider = {
      question: 'slider',
      responseType: 'slider',
      responseValues: {
        minLabel: 'min',
        maxLabel: 'max',
        minValue: 0,
        maxValue: 5,
        minImage: null,
        maxImage: null,
        scores: [1, 2, 3, 4, 5, 6],
        alerts: null,
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        addScores: true,
        setAlerts: false,
        additionalResponseOption: {
          textInputOption: true,
          textInputRequired: false,
        },
        showTickMarks: false,
        showTickLabels: false,
        continuousSlider: false,
        timer: 0,
      },
      name: 'slider_text_score',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: 'e71791c3-1eec-4a70-8314-62e065d87649',
    };
    const sliderAnswer = {
      value: 5,
    };
    const date = {
      question: 'date',
      responseType: 'date',
      responseValues: null,
      config: {
        removeBackButton: false,
        skippableItem: false,
        additionalResponseOption: {
          textInputOption: true,
          textInputRequired: false,
        },
        timer: 0,
      },
      name: 'date_text',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: '58cfb438-7076-4466-8c05-4fc45484e5e8',
    };
    const dateAnswer = {
      value: {
        day: 18,
        month: 6,
        year: 2023,
      },
    };
    const numberSelection = {
      question: 'number_selection_text',
      responseType: 'numberSelect',
      responseValues: {
        minValue: 0,
        maxValue: 7,
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        additionalResponseOption: {
          textInputOption: true,
          textInputRequired: false,
        },
      },
      name: 'number_selection_text',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: 'f6a40f32-e35c-4b21-acf9-e692f3844956',
    };
    const numberSelectionAnswer = {
      value: '5',
    };
    const time = {
      question: 'time_text',
      responseType: 'time',
      responseValues: null,
      config: {
        removeBackButton: false,
        skippableItem: false,
        additionalResponseOption: {
          textInputOption: true,
          textInputRequired: false,
        },
        timer: 0,
      },
      name: 'time_text',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: '4f6f86f8-7f0f-41c6-99d9-5725c2ab1012',
    };
    const timeAnswer = {
      value: {
        minutes: 19,
        hours: 13,
      },
    };
    const timeRange = {
      question: 'time_range_text',
      responseType: 'timeRange',
      responseValues: null,
      config: {
        removeBackButton: false,
        skippableItem: false,
        additionalResponseOption: {
          textInputOption: true,
          textInputRequired: false,
        },
        timer: 0,
      },
      name: 'time_range_text',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: 'a03db7c1-79c3-4ba8-94e2-5a99144502b6',
    };
    const timeRangeAnswer = {
      value: {
        from: {
          hour: 9,
          minute: 20,
        },
        to: {
          hour: 17,
          minute: 20,
        },
      },
    };
    const singleSelectRows = {
      question: 'single_row_score',
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
      id: 'e458f358-f541-4ce0-9443-e8097ecea6b6',
    };
    const singleSelectRowsAnswer = {
      value: ['opt1'],
    };
    const multiSelectRows = {
      question: 'multi_row_score',
      responseType: 'multiSelectRows',
      responseValues: {
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
      name: 'multi_row_score',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: '11fe471c-f13e-47fa-a3f3-0756352a0e85',
    };
    const multiSelectRowsAnswer = {
      value: [['opt1', 'opt1']],
    };
    const sliderRows = {
      question: 'slider_row_score',
      responseType: 'sliderRows',
      responseValues: {
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
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        addScores: true,
        setAlerts: false,
        timer: 0,
      },
      name: 'slider_row_score',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: '40eac2e1-4837-4e99-83c7-562578d78354',
    };
    const sliderRowsAnswer = {
      value: [5],
    };
    const text = {
      question: 'text',
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
      name: 'text',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: 'bf171977-fe94-49b6-b885-980c4cf3936f',
    };
    const textAnswer = 'Text';
    const photo = {
      question: 'photo_text',
      responseType: 'photo',
      responseValues: null,
      config: {
        removeBackButton: false,
        skippableItem: false,
        additionalResponseOption: {
          textInputOption: true,
          textInputRequired: false,
        },
        timer: 0,
      },
      name: 'photo_text',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: '934d1ccf-3713-48f0-b852-66e24fd0ba69',
    };
    const photoAnswer = {
      value:
        'https://media-dev.cmiml.net/mindlogger/2048412251058983019/c6784a7e-579e-4f2b-829c-fafed179f579/rn_image_picker_lib_temp_2e5fafad-f7c3-4fc4-8045-b763dd0e745c.jpg',
    };
    const video = {
      question: 'video_text',
      responseType: 'video',
      responseValues: null,
      config: {
        removeBackButton: false,
        skippableItem: false,
        additionalResponseOption: {
          textInputOption: true,
          textInputRequired: false,
        },
        timer: 0,
      },
      name: 'video_text',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: '8b3a7eb9-c48c-4e16-a7a9-c1796e411481',
    };
    const videoAnswer = {
      value:
        'https://media-dev.cmiml.net/mindlogger/2048412251058983019/b583f860-cc9b-4f9d-947d-d526b66cb249/rn_image_picker_lib_temp_96d08aab-74b3-4351-96be-d4ea6964e7ca.mp4',
    };
    const audio = {
      question: 'audio_text',
      responseType: 'audio',
      responseValues: {
        maxDuration: 300,
      },
      config: {
        removeBackButton: false,
        skippableItem: true,
        additionalResponseOption: {
          textInputOption: true,
          textInputRequired: false,
        },
        timer: 0,
      },
      name: 'audio_text',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: '8b1f7e47-3a80-475b-80ca-8aacde655117',
    };
    const audioAnswer = {
      value:
        'https://media-dev.cmiml.net/mindlogger/2048412251058983019/62dbf5f6-fd05-435a-9cb5-091e25d43cda/c0e55d96-b23f-4ae1-93e2-b8b498346b44.m4a',
    };
    const drawing = {
      question: 'drawing\n',
      responseType: 'drawing',
      responseValues: {
        drawingExample:
          'https://media-dev.cmiml.net/mindlogger/391962851007982489/12cbda19-337f-47d5-bdb1-c6c78d324690/5.jpg',
        drawingBackground:
          'https://media-dev.cmiml.net/mindlogger/391962851007982489/07d189c3-3d5d-4013-8af8-25ebb6af5222/4.jpg',
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        timer: 0,
        removeUndoButton: false,
        navigationToTop: false,
      },
      name: 'drawing',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: 'e2e611df-02d5-4316-8406-c5d685b94090',
    };
    const drawingAnswer = {
      value: {
        svgString: '', // <svg/> path
        width: 362.7272644042969,
        fileName: 'e2e611df-02d5-4316-8406-c5d685b94090.svg',
        type: 'image/svg',
        uri: 'https://media-dev.cmiml.net/mindlogger/2048412251058983019/023cf7e7-6083-443a-b74a-f32b75a711cd/e2e611df-02d5-4316-8406-c5d685b94090.svg',
        lines: [], // coordinates
      },
    };
    const drawingAnswerWithText = {
      text: 'description',
      ...drawingAnswer,
    };

    describe('response values for report.csv', () => {
      const index = 0;
      const isEvent = false;

      test.each`
        activityItem        | answer                                         | expected                                                                                                       | description
        ${single}           | ${singleAnswer}                                | ${'value: 1'}                                                                                                  | ${'single select'}
        ${single}           | ${singleWithEditionAnswer}                     | ${'value: 2 | edited: time of edition'}                                                                        | ${'single select with edition'}
        ${single}           | ${singleWithAdditionalTextAnswer}              | ${'value: 4 | text: description for answer'}                                                                   | ${'single select with additional text'}
        ${single}           | ${singleWithAdditionalTextAndWrongOrderAnswer} | ${'value: 7 | text: single selection description'}                                                             | ${'single select with additional text with wrong property order'}
        ${single}           | ${singleWithAdditionalTextWithNoAnswer}        | ${'text: single selection description'}                                                                        | ${'single select without answer with additional text'}
        ${multi}            | ${multiAnswer}                                 | ${'value: 1'}                                                                                                  | ${'multi select'}
        ${slider}           | ${sliderAnswer}                                | ${'value: 5'}                                                                                                  | ${'slider'}
        ${date}             | ${dateAnswer}                                  | ${'date: 18/6/2023'}                                                                                           | ${'date'}
        ${numberSelection}  | ${numberSelectionAnswer}                       | ${'value: 5'}                                                                                                  | ${'number selection'}
        ${time}             | ${timeAnswer}                                  | ${'time: hr 13, min 19'}                                                                                       | ${'time'}
        ${timeRange}        | ${timeRangeAnswer}                             | ${'time_range: from (hr 9, min 20) / to (hr 17, min 20)'}                                                      | ${'time range'}
        ${singleSelectRows} | ${singleSelectRowsAnswer}                      | ${'row1: opt1'}                                                                                                | ${'single select rows'}
        ${multiSelectRows}  | ${multiSelectRowsAnswer}                       | ${'row1: opt1, opt1'}                                                                                          | ${'multi select rows'}
        ${sliderRows}       | ${sliderRowsAnswer}                            | ${'slider: 5'}                                                                                                 | ${'slider rows'}
        ${text}             | ${textAnswer}                                  | ${'Text'}                                                                                                      | ${'text'}
        ${photo}            | ${photoAnswer}                                 | ${'3cf61844-e5d0-40bd-a1b6-f2d3220f68e3-835e5277-5949-4dff-817a-d85c17a3604f-photo_text.jpg'}                  | ${'photo'}
        ${video}            | ${videoAnswer}                                 | ${'3cf61844-e5d0-40bd-a1b6-f2d3220f68e3-835e5277-5949-4dff-817a-d85c17a3604f-video_text.mp4'}                  | ${'video'}
        ${audio}            | ${audioAnswer}                                 | ${'3cf61844-e5d0-40bd-a1b6-f2d3220f68e3-835e5277-5949-4dff-817a-d85c17a3604f-audio_text.m4a'}                  | ${'audio'}
        ${drawing}          | ${drawingAnswer}                               | ${'3cf61844-e5d0-40bd-a1b6-f2d3220f68e3-835e5277-5949-4dff-817a-d85c17a3604f-drawing.svg'}                     | ${'drawing'}
        ${drawing}          | ${drawingAnswerWithText}                       | ${'3cf61844-e5d0-40bd-a1b6-f2d3220f68e3-835e5277-5949-4dff-817a-d85c17a3604f-drawing.svg | text: description'} | ${'drawing with additional text'}
      `('$description: "$expected"', ({ activityItem, answer, expected }) => {
        const item = {
          ...mockedSharedDecryptedAnswerData,
          activityItem,
          answer,
        };
        expect(
          parseResponseValue(
            /* eslint-disable @typescript-eslint/ban-ts-comment */
            // @ts-ignore
            item as DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>,
            index,
            isEvent,
          ),
        ).toBe(expected);
      });
    });

    describe('responses for activity_user_journey.csv', () => {
      const index = 0;
      const isEvent = true;
      const sharedEventProps = {
        time: 1686902413722,
        response: {
          value: 1,
        },
        screen: 'f21a80cb-c5a2-442b-a6b1-37af779908c7/59cdc2ab-6c91-4edf-9133-7bfa9333f97c',
      };
      const setAnswerEvent = {
        ...sharedEventProps,
        type: 'SET_ANSWER',
      };
      const prevEvent = {
        ...sharedEventProps,
        type: 'PREV',
      };
      const nextEvent = {
        ...sharedEventProps,
        type: 'NEXT',
      };
      const doneEvent = {
        ...sharedEventProps,
        type: 'DONE',
      };
      const undoEvent = {
        ...sharedEventProps,
        type: 'UNDO',
      };
      const skipEvent = {
        ...sharedEventProps,
        type: 'SKIP',
      };

      test.each`
        activityItem | answer                            | event             | expected      | description
        ${single}    | ${singleAnswer}                   | ${setAnswerEvent} | ${'value: 1'} | ${'SET_ANSWER event'}
        ${single}    | ${singleWithEditionAnswer}        | ${prevEvent}      | ${''}         | ${'PREV event'}
        ${single}    | ${singleWithAdditionalTextAnswer} | ${nextEvent}      | ${''}         | ${'NEXT event'}
        ${slider}    | ${sliderAnswer}                   | ${undoEvent}      | ${''}         | ${'UNDO event'}
        ${slider}    | ${sliderAnswer}                   | ${skipEvent}      | ${''}         | ${'SKIP event'}
        ${multi}     | ${multiAnswer}                    | ${doneEvent}      | ${''}         | ${'DONE event'}
      `('$description: "$expected"', ({ activityItem, answer, event, expected }) => {
        const item: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption> = {
          ...mockedSharedDecryptedAnswerData,
          activityItem,
          answer,
          ...event,
        };
        expect(parseResponseValue(item, index, isEvent)).toBe(expected);
      });
    });
  });
  describe('gyroscope activity', () => {
    const index = 0;
    const isEvent = false;
    const mockedSharedDecryptedAnswerData = {
      id: '388b1c27-39da-454b-a31f-3cadf1893985',
      submitId: 'c0009ccf-91ca-414c-b75e-ef9ce69bd2f4',
      version: '1.1.0',
      respondentId: '835e5277-5949-4dff-817a-d85c17a3604f',
      respondentSecretId: 'respondentSecretId',
      legacyProfileId: null,
      scheduledDatetime: null,
      startDatetime: 1689145017,
      endDatetime: 1689145496,
      migratedDate: null,
      appletHistoryId: '176147f5-cdf7-4da8-b4c4-28deb517ec1e_1.1.0',
      activityHistoryId: '23f26fc9-c92c-4870-9180-22f6df8b6566_1.1.0',
      flowHistoryId: null,
      flowName: null,
      reviewedAnswerId: null,
      createdAt: '2023-07-12T07:07:54.596167',
      appletId: '176147f5-cdf7-4da8-b4c4-28deb517ec1e',
      activityId: '23f26fc9-c92c-4870-9180-22f6df8b6566',
      flowId: null,
      items: [], // items
      activityName: 'CST Gyroscope',
      subscaleSetting: null,
    };
    const gyroscopeTest = {
      question: '',
      responseType: 'stabilityTracker',
      responseValues: null,
      config: {
        userInputType: 'gyroscope',
        phase: 'test',
        trialsNumber: 3,
        durationMinutes: 5,
        lambdaSlope: 20,
        maxOffTargetTime: 10,
        numTestTrials: 10,
        taskMode: 'pseudo_stair',
        trackingDims: 2,
        showScore: true,
        basisFunc: 'zeros_1d',
        noiseLevel: 0,
        taskLoopRate: 0.0167,
        cyclesPerMin: 2,
        oobDuration: 0.2,
        initialLambda: 0.075,
        showPreview: true,
        numPreviewStim: 0,
        previewStepGap: 100,
        dimensionCount: 1,
        maxRad: 0.26167,
      },
      name: 'Gyroscope_Test',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: false,
      id: 'b16744b6-6f92-4c63-bdf7-9c4285861b3b',
    };
    const gyroscopeTestAnswer = {
      value: {
        value: [], // coordinates
        maxLambda: 1.4693392144625441,
        phaseType: 'challenge-phase',
      },
    };
    const gyrospocePractice = {
      question: '',
      responseType: 'stabilityTracker',
      responseValues: null,
      config: {
        userInputType: 'gyroscope',
        phase: 'practice',
        trialsNumber: 3,
        durationMinutes: 5,
        lambdaSlope: 20,
        maxOffTargetTime: 10,
        numTestTrials: 10,
        taskMode: 'pseudo_stair',
        trackingDims: 2,
        showScore: true,
        basisFunc: 'zeros_1d',
        noiseLevel: 0,
        taskLoopRate: 0.0167,
        cyclesPerMin: 2,
        oobDuration: 0.2,
        initialLambda: 0.075,
        showPreview: true,
        numPreviewStim: 0,
        previewStepGap: 100,
        dimensionCount: 1,
        maxRad: 0.26167,
      },
      name: 'Gyroscope_Calibration_Practice',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: false,
      id: 'c319f700-83b8-4226-a822-9d8de3191759',
    };
    const gyroscopePracticeAnswer = {
      value: {
        value: [], // coordinates
        maxLambda: 1.4439485786709796,
        phaseType: 'focus-phase',
      },
    };

    test.each`
      activityItem         | answer                     | expected                                                      | description
      ${gyroscopeTest}     | ${gyroscopeTestAnswer}     | ${'388b1c27-39da-454b-a31f-3cadf1893985_challenge-phase.csv'} | ${'gyroscope test'}
      ${gyrospocePractice} | ${gyroscopePracticeAnswer} | ${'388b1c27-39da-454b-a31f-3cadf1893985_focus-phase.csv'}     | ${'gyroscope practice'}
    `('$description: "$expected"', ({ activityItem, answer, expected }) => {
      const item = {
        ...mockedSharedDecryptedAnswerData,
        activityItem,
        answer,
      };
      expect(
        parseResponseValue(
          // @ts-ignore
          item as DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>,
          index,
          isEvent,
        ),
      ).toBe(expected);
    });
  });
  describe('touch activity', () => {
    const index = 0;
    const isEvent = false;
    const mockedSharedDecryptedAnswerData = {
      id: '5bc795cf-7eea-4042-9c48-f83435f66639',
      submitId: 'e16b73c9-4159-43e1-994c-6cecca7041bc',
      version: '1.1.0',
      respondentId: '835e5277-5949-4dff-817a-d85c17a3604f',
      respondentSecretId: 'respondentSecretId',
      legacyProfileId: null,
      scheduledDatetime: null,
      startDatetime: 1689145854,
      endDatetime: 1689146206,
      migratedDate: null,
      appletHistoryId: '176147f5-cdf7-4da8-b4c4-28deb517ec1e_1.1.0',
      activityHistoryId: '9e0da3f4-2a2a-4b13-b1f4-9a0d66646536_1.1.0',
      flowHistoryId: null,
      flowName: null,
      reviewedAnswerId: null,
      createdAt: '2023-07-12T07:18:35.751847',
      appletId: '176147f5-cdf7-4da8-b4c4-28deb517ec1e',
      activityId: '9e0da3f4-2a2a-4b13-b1f4-9a0d66646536',
      flowId: null,
      items: [], // items
      activityName: 'CST Touch',
      subscaleSetting: null,
    };
    const touchTest = {
      question: '',
      responseType: 'stabilityTracker',
      responseValues: null,
      config: {
        userInputType: 'touch',
        phase: 'test',
        trialsNumber: 3,
        durationMinutes: 5,
        lambdaSlope: 20,
        maxOffTargetTime: 10,
        numTestTrials: 10,
        taskMode: 'pseudo_stair',
        trackingDims: 2,
        showScore: true,
        basisFunc: 'zeros_1d',
        noiseLevel: 0,
        taskLoopRate: 0.0167,
        cyclesPerMin: 2,
        oobDuration: 0.2,
        initialLambda: 0.075,
        showPreview: true,
        numPreviewStim: 0,
        previewStepGap: 100,
        dimensionCount: 1,
        maxRad: 0.26167,
      },
      name: 'Touch_Test',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: false,
      id: 'dded8e99-3b26-47d2-add5-6faff1578450',
    };
    const touchTestAnswer = {
      value: {
        value: [], // coordinates
        maxLambda: 1.4439485786709796,
        phaseType: 'challenge-phase',
      },
    };
    const touchPractice = {
      question: '',
      responseType: 'stabilityTracker',
      responseValues: null,
      config: {
        userInputType: 'touch',
        phase: 'practice',
        trialsNumber: 3,
        durationMinutes: 5,
        lambdaSlope: 20,
        maxOffTargetTime: 10,
        numTestTrials: 10,
        taskMode: 'pseudo_stair',
        trackingDims: 2,
        showScore: true,
        basisFunc: 'zeros_1d',
        noiseLevel: 0,
        taskLoopRate: 0.0167,
        cyclesPerMin: 2,
        oobDuration: 0.2,
        initialLambda: 0.075,
        showPreview: true,
        numPreviewStim: 0,
        previewStepGap: 100,
        dimensionCount: 1,
        maxRad: 0.26167,
      },
      name: 'Touch_Calibration_Practice',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: false,
      id: '37c35801-683c-4880-b95f-42ba4dd53768',
    };
    const touchPracticeAnswer = {
      value: {
        value: [], // coordinates
        maxLambda: 0.3538753796195805,
        phaseType: 'focus-phase',
      },
    };

    test.each`
      activityItem     | answer                 | expected                                                      | description
      ${touchTest}     | ${touchTestAnswer}     | ${'5bc795cf-7eea-4042-9c48-f83435f66639_challenge-phase.csv'} | ${'gyroscope test'}
      ${touchPractice} | ${touchPracticeAnswer} | ${'5bc795cf-7eea-4042-9c48-f83435f66639_focus-phase.csv'}     | ${'gyroscope practice'}
    `('$description: "$expected"', ({ activityItem, answer, expected }) => {
      const item = {
        ...mockedSharedDecryptedAnswerData,
        activityItem,
        answer,
      };
      expect(
        parseResponseValue(
          // @ts-ignore
          item as DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>,
          index,
          isEvent,
        ),
      ).toBe(expected);
    });
  });
  describe('A/B Trails Mobile activity', () => {
    const isEvent = false;
    const mockedSharedDecryptedAnswerData = {
      id: '4d3b9ef2-beff-4464-a567-088362a66238',
      submitId: 'bf0fb332-8b45-4f4a-a67e-06e9006bb8b8',
      version: '1.1.0',
      respondentId: '835e5277-5949-4dff-817a-d85c17a3604f',
      respondentSecretId: 'ml_test1_account@gmail.com',
      legacyProfileId: null,
      scheduledDatetime: null,
      startDatetime: 1689928691,
      endDatetime: 1689928750,
      migratedDate: null,
      appletHistoryId: '3c32e00a-70c8-4f97-b549-5b536e9f8719_1.1.0',
      activityHistoryId: '61b54902-ed52-4ed3-bac2-015596aeb723_1.1.0',
      flowHistoryId: null,
      flowName: null,
      reviewedAnswerId: null,
      createdAt: '2023-07-21T08:39:18.374009',
      appletId: '3c32e00a-70c8-4f97-b549-5b536e9f8719',
      activityId: '61b54902-ed52-4ed3-bac2-015596aeb723',
      flowId: null,
      items: [], // items
      activityName: 'A/B Trails Mobile (1)',
      subscaleSetting: null,
    };
    const abTrails1 = {
      question: '',
      responseType: 'ABTrails',
      responseValues: null,
      config: {
        deviceType: 'mobile',
        orderName: 'first',
        tutorials: {
          tutorials: [
            {
              text: 'There are numbers in circles on this screen.',
              nodeLabel: null,
            },
            {
              text: 'You will take a pen and draw a line from one number to the next, in order.',
              nodeLabel: null,
            },
            {
              text: 'Start at 1.',
              nodeLabel: '1',
            },
            {
              text: 'Then go to 2.',
              nodeLabel: '2',
            },
            {
              text: 'Then 3, and so on.',
              nodeLabel: '3',
            },
            {
              text: 'Please try not to lift the pen as you move from one number to the next. Work as quickly as you can.',
              nodeLabel: null,
            },
            {
              text: 'Begin here.',
              nodeLabel: '1',
            },
            {
              text: 'And end here.',
              nodeLabel: '11',
            },
            {
              text: 'Click next to start',
              nodeLabel: null,
            },
          ],
        },
        nodes: {
          radius: 4.18,
          fontSize: 5.6,
          fontSizeBeginEnd: null,
          beginWordLength: null,
          endWordLength: null,
          nodes: [], // coordinates
        },
      },
      name: 'ABTrails_mobile_1',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: false,
      id: 'e033d4da-3044-46b0-a6f8-b348319795c4',
    };
    const abTrails1Answer = {
      value: {
        currentIndex: 11,
        startTime: 1689928696128,
        width: 362.7272644042969,
        updated: true,
        lines: [], // points
      },
    };
    const abTrails2 = {
      question: '',
      responseType: 'ABTrails',
      responseValues: null,
      config: {
        deviceType: 'mobile',
        orderName: 'second',
        tutorials: {
          tutorials: [
            {
              text: 'On this screen are more numbers in circles.',
              nodeLabel: null,
            },
            {
              text: 'You will take a pen and draw a line from one circle to the next, in order.',
              nodeLabel: null,
            },
            {
              text: 'Start at 1.',
              nodeLabel: '1',
            },
            {
              text: 'And End here.',
              nodeLabel: '11',
            },
            {
              text: 'Please try not to lift the pen as you move from one circle to the next.',
              nodeLabel: null,
            },
            {
              text: 'Work as quickly as you can.',
              nodeLabel: null,
            },
            {
              text: 'Click next to start',
              nodeLabel: null,
            },
          ],
        },
        nodes: {
          radius: 4.18,
          fontSize: 5.97,
          fontSizeBeginEnd: null,
          beginWordLength: null,
          endWordLength: null,
          nodes: [], // nodes
        },
      },
      name: 'ABTrails_mobile_2',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: false,
      id: '74531594-6157-4a0e-b905-8f4bed904aa8',
    };
    const abTrails2Answer = {
      value: {
        currentIndex: 11,
        startTime: 1689928709308,
        updated: true,
        width: 362.7272644042969,
        lines: [], // points
      },
    };
    const abTrails3 = {
      question: '',
      responseType: 'ABTrails',
      responseValues: null,
      config: {
        deviceType: 'mobile',
        orderName: 'third',
        tutorials: {
          tutorials: [
            {
              text: 'There are numbers and letters in circles on this screen.',
              nodeLabel: null,
            },
            {
              text: 'You will take a pen and draw a line alternating in order between the numbers and letters.',
              nodeLabel: null,
            },
            {
              text: 'Start at number 1.',
              nodeLabel: '1',
            },
            {
              text: 'Then go to the first letter A.',
              nodeLabel: 'A',
            },
            {
              text: 'Then go to the next number 2.',
              nodeLabel: '2',
            },
            {
              text: 'Then go to the next letter B, and so on.',
              nodeLabel: 'B',
            },
            {
              text: 'Please try not to lift the pen as you move from one number to the next. Work as quickly as you can.',
              nodeLabel: null,
            },
            {
              text: 'Begin here.',
              nodeLabel: '1',
            },
            {
              text: 'And end here.',
              nodeLabel: '6',
            },
            {
              text: 'Click next to start',
              nodeLabel: null,
            },
          ],
        },
        nodes: {
          radius: 4.18,
          fontSize: 5.97,
          fontSizeBeginEnd: null,
          beginWordLength: null,
          endWordLength: null,
          nodes: [], // nodes
        },
      },
      name: 'ABTrails_mobile_3',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: false,
      id: '0613f253-b95a-4ef2-abea-0d725efa9b5d',
    };
    const abTrails3Answer = {
      value: {
        currentIndex: 11,
        startTime: 1689928725170,
        updated: true,
        width: 362.7272644042969,
        lines: [], // points
      },
    };
    const abTrails4 = {
      question: '',
      responseType: 'ABTrails',
      responseValues: null,
      config: {
        deviceType: 'mobile',
        orderName: 'fourth',
        tutorials: {
          tutorials: [
            {
              text: 'On this screen there are more numbers and letters in circles.',
              nodeLabel: null,
            },
            {
              text: 'You will take a pen and draw a line from one circle to the next.',
              nodeLabel: null,
            },
            {
              text: 'Alternating in order between the numbers and letters.',
              nodeLabel: null,
            },
            {
              text: 'Start at 1.',
              nodeLabel: '1',
            },
            {
              text: 'And end here.',
              nodeLabel: '6',
            },
            {
              text: 'Please try not to lift the pen as you move from one circle to the next.',
              nodeLabel: null,
            },
            {
              text: 'Work as quickly as you can.',
              nodeLabel: null,
            },
            {
              text: 'Click next to start',
              nodeLabel: null,
            },
          ],
        },
        nodes: {
          radius: 4.18,
          fontSize: 5.97,
          fontSizeBeginEnd: null,
          beginWordLength: null,
          endWordLength: null,
          nodes: [], // nodes
        },
      },
      name: 'ABTrails_mobile_4',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: false,
      id: 'ac3b0f77-719f-489c-95ab-9cf687f0b881',
    };
    const abTrails4Answer = {
      value: {
        currentIndex: 11,
        startTime: 1689928739243,
        updated: true,
        width: 362.7272644042969,
        lines: [], // points
      },
    };

    test.each`
      activityItem | answer             | index | expected                                             | description
      ${abTrails1} | ${abTrails1Answer} | ${0}  | ${'4d3b9ef2-beff-4464-a567-088362a66238-trail1.csv'} | ${'ABTrails_mobile_1'}
      ${abTrails2} | ${abTrails2Answer} | ${1}  | ${'4d3b9ef2-beff-4464-a567-088362a66238-trail2.csv'} | ${'ABTrails_mobile_2'}
      ${abTrails3} | ${abTrails3Answer} | ${2}  | ${'4d3b9ef2-beff-4464-a567-088362a66238-trail3.csv'} | ${'ABTrails_mobile_3'}
      ${abTrails4} | ${abTrails4Answer} | ${3}  | ${'4d3b9ef2-beff-4464-a567-088362a66238-trail4.csv'} | ${'ABTrails_mobile_4'}
    `('$description: "$expected"', ({ activityItem, answer, index, expected }) => {
      const item = {
        ...mockedSharedDecryptedAnswerData,
        activityItem,
        answer,
      };
      expect(
        parseResponseValue(
          // @ts-ignore
          item as DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>,
          index,
          isEvent,
        ),
      ).toBe(expected);
    });
  });
  describe('flanker activity', () => {
    const index = 0;
    const isEvent = false;
    const mockedSharedDecryptedAnswerData = {
      id: 'bce5d577-414f-482b-b5ba-e29004b66213',
      submitId: 'e065fab7-5437-4bf6-a6d9-169bfb10edc4',
      version: '1.1.0',
      respondentId: '37a9cb49-99aa-4d25-acbe-951ba5f8939b',
      respondentSecretId: 'respondentSecretId',
      legacyProfileId: null,
      scheduledDatetime: null,
      startDatetime: 1689604761,
      endDatetime: 1689604893,
      migratedDate: null,
      appletHistoryId: '03e3fa14-66bb-4013-9901-03afe5789b18_1.1.0',
      activityHistoryId: '9b23f401-b0da-47d6-80fd-f0896fee31f7_1.1.0',
      flowHistoryId: null,
      flowName: null,
      reviewedAnswerId: null,
      createdAt: '2023-07-17T14:41:39.170170',
      appletId: '03e3fa14-66bb-4013-9901-03afe5789b18',
      activityId: '9b23f401-b0da-47d6-80fd-f0896fee31f7',
      flowId: null,
      items: [], // items
      activityName: 'Simple & Choice Reaction Time Task Builder',
      subscaleSetting: null,
    };
    const flankerPractice = {
      question: '',
      responseType: 'flanker',
      responseValues: null,
      config: {
        stimulusTrials: [
          {
            id: '1c60f5cb-3668-49ef-b2be-c68643aa4ca1',
            image:
              'https://media-dev.cmiml.net/mindlogger/391962851007982489/62e876f7-3144-4774-aaf1-aaf1ed3001eb/6.jpg',
            text: '6.jpg',
            value: 0,
            weight: null,
          },
        ],
        blocks: [
          {
            name: 'Block 1',
            order: ['1c60f5cb-3668-49ef-b2be-c68643aa4ca1'],
          },
          {
            name: 'Block 2',
            order: ['1c60f5cb-3668-49ef-b2be-c68643aa4ca1'],
          },
          {
            name: 'Block 3',
            order: ['1c60f5cb-3668-49ef-b2be-c68643aa4ca1'],
          },
          {
            name: 'Block 4',
            order: ['1c60f5cb-3668-49ef-b2be-c68643aa4ca1'],
          },
        ],
        buttons: [
          {
            text: 'L_btn',
            image: '',
            value: 0,
          },
          {
            text: 'R_btn',
            image: '',
            value: 1,
          },
        ],
        nextButton: 'OK',
        fixationDuration: 3000,
        fixationScreen: {
          value: '5.jpg',
          image:
            'https://media-dev.cmiml.net/mindlogger/391962851007982489/50635b4f-7457-4677-9d2d-99132189eba2/5.jpg',
        },
        minimumAccuracy: 75,
        sampleSize: 1,
        samplingMethod: 'randomize-order',
        showFeedback: true,
        showFixation: true,
        showResults: true,
        trialDuration: 3000,
        isLastPractice: false,
        isFirstPractice: true,
        isLastTest: false,
        blockType: 'practice',
      },
      name: 'Flanker_Practice_1',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: false,
      id: 'a64df283-838f-44cc-adf9-be438c0597dc',
    };
    const flankerPracticeAnswer = {
      value: [], //values
    };
    const flankerTest1 = {
      question: '',
      responseType: 'flanker',
      responseValues: null,
      config: {
        stimulusTrials: [
          {
            id: '1c60f5cb-3668-49ef-b2be-c68643aa4ca1',
            image:
              'https://media-dev.cmiml.net/mindlogger/391962851007982489/62e876f7-3144-4774-aaf1-aaf1ed3001eb/6.jpg',
            text: '6.jpg',
            value: 0,
            weight: null,
          },
        ],
        blocks: [
          {
            name: 'Block 1',
            order: ['1c60f5cb-3668-49ef-b2be-c68643aa4ca1'],
          },
          {
            name: 'Block 2',
            order: ['1c60f5cb-3668-49ef-b2be-c68643aa4ca1'],
          },
          {
            name: 'Block 3',
            order: ['1c60f5cb-3668-49ef-b2be-c68643aa4ca1'],
          },
          {
            name: 'Block 4',
            order: ['1c60f5cb-3668-49ef-b2be-c68643aa4ca1'],
          },
        ],
        buttons: [
          {
            text: 'L_btn',
            image: '',
            value: 0,
          },
          {
            text: 'R_btn',
            image: '',
            value: 1,
          },
        ],
        nextButton: 'Continue',
        fixationDuration: 3000,
        fixationScreen: {
          value: '5.jpg',
          image:
            'https://media-dev.cmiml.net/mindlogger/391962851007982489/50635b4f-7457-4677-9d2d-99132189eba2/5.jpg',
        },
        minimumAccuracy: null,
        sampleSize: 1,
        samplingMethod: 'randomize-order',
        showFeedback: false,
        showFixation: true,
        showResults: true,
        trialDuration: 3000,
        isLastPractice: false,
        isFirstPractice: false,
        isLastTest: false,
        blockType: 'test',
      },
      name: 'Flanker_test_1',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: false,
      id: '1644cce8-ee6b-469a-a400-45cb5a96f36c',
    };
    const flankerTest1Answer = {
      value: [], //values
    };
    const flankerTest2 = {
      question: '',
      responseType: 'flanker',
      responseValues: null,
      config: {
        stimulusTrials: [
          {
            id: '1c60f5cb-3668-49ef-b2be-c68643aa4ca1',
            image:
              'https://media-dev.cmiml.net/mindlogger/391962851007982489/62e876f7-3144-4774-aaf1-aaf1ed3001eb/6.jpg',
            text: '6.jpg',
            value: 0,
            weight: null,
          },
        ],
        blocks: [
          {
            name: 'Block 1',
            order: ['1c60f5cb-3668-49ef-b2be-c68643aa4ca1'],
          },
          {
            name: 'Block 2',
            order: ['1c60f5cb-3668-49ef-b2be-c68643aa4ca1'],
          },
          {
            name: 'Block 3',
            order: ['1c60f5cb-3668-49ef-b2be-c68643aa4ca1'],
          },
          {
            name: 'Block 4',
            order: ['1c60f5cb-3668-49ef-b2be-c68643aa4ca1'],
          },
        ],
        buttons: [
          {
            text: 'L_btn',
            image: '',
            value: 0,
          },
          {
            text: 'R_btn',
            image: '',
            value: 1,
          },
        ],
        nextButton: 'Continue',
        fixationDuration: 3000,
        fixationScreen: {
          value: '5.jpg',
          image:
            'https://media-dev.cmiml.net/mindlogger/391962851007982489/50635b4f-7457-4677-9d2d-99132189eba2/5.jpg',
        },
        minimumAccuracy: null,
        sampleSize: 1,
        samplingMethod: 'randomize-order',
        showFeedback: false,
        showFixation: true,
        showResults: true,
        trialDuration: 3000,
        isLastPractice: false,
        isFirstPractice: false,
        isLastTest: false,
        blockType: 'test',
      },
      name: 'Flanker_test_2',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: false,
      id: 'fcc864b4-f4f8-4cfe-bb04-7fa4532cf307',
    };
    const flankerTest2Answer = {
      value: [], //values
    };
    const flankerTest3 = {
      question: '',
      responseType: 'flanker',
      responseValues: null,
      config: {
        stimulusTrials: [
          {
            id: '1c60f5cb-3668-49ef-b2be-c68643aa4ca1',
            image:
              'https://media-dev.cmiml.net/mindlogger/391962851007982489/62e876f7-3144-4774-aaf1-aaf1ed3001eb/6.jpg',
            text: '6.jpg',
            value: 0,
            weight: null,
          },
        ],
        blocks: [
          {
            name: 'Block 1',
            order: ['1c60f5cb-3668-49ef-b2be-c68643aa4ca1'],
          },
          {
            name: 'Block 2',
            order: ['1c60f5cb-3668-49ef-b2be-c68643aa4ca1'],
          },
          {
            name: 'Block 3',
            order: ['1c60f5cb-3668-49ef-b2be-c68643aa4ca1'],
          },
          {
            name: 'Block 4',
            order: ['1c60f5cb-3668-49ef-b2be-c68643aa4ca1'],
          },
        ],
        buttons: [
          {
            text: 'L_btn',
            image: '',
            value: 0,
          },
          {
            text: 'R_btn',
            image: '',
            value: 1,
          },
        ],
        nextButton: 'Finish',
        fixationDuration: 3000,
        fixationScreen: {
          value: '5.jpg',
          image:
            'https://media-dev.cmiml.net/mindlogger/391962851007982489/50635b4f-7457-4677-9d2d-99132189eba2/5.jpg',
        },
        minimumAccuracy: null,
        sampleSize: 1,
        samplingMethod: 'randomize-order',
        showFeedback: false,
        showFixation: true,
        showResults: true,
        trialDuration: 3000,
        isLastPractice: false,
        isFirstPractice: false,
        isLastTest: true,
        blockType: 'test',
      },
      name: 'Flanker_test_3',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: false,
      id: 'fd67dc8e-362b-40cd-b612-9303eca62c01',
    };
    const flankerTest3Answer = {
      value: [], //values
    };

    test.each`
      activityItem       | answer                   | expected                                                         | description
      ${flankerPractice} | ${flankerPracticeAnswer} | ${'bce5d577-414f-482b-b5ba-e29004b66213-Flanker_Practice_1.csv'} | ${'Flanker_Practice_1'}
      ${flankerTest1}    | ${flankerTest1Answer}    | ${'bce5d577-414f-482b-b5ba-e29004b66213-Flanker_test_1.csv'}     | ${'Flanker_test_1'}
      ${flankerTest2}    | ${flankerTest2Answer}    | ${'bce5d577-414f-482b-b5ba-e29004b66213-Flanker_test_2.csv'}     | ${'Flanker_test_2'}
      ${flankerTest3}    | ${flankerTest3Answer}    | ${'bce5d577-414f-482b-b5ba-e29004b66213-Flanker_test_3.csv'}     | ${'Flanker_test_3'}
    `('$description: "$expected"', ({ activityItem, answer, expected }) => {
      const item = {
        ...mockedSharedDecryptedAnswerData,
        activityItem,
        answer,
      };
      expect(
        parseResponseValue(
          // @ts-ignore
          item as DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>,
          index,
          isEvent,
        ),
      ).toBe(expected);
    });
  });
  describe('isNullAnswer', () => {
    test.each`
      obj             | result   | description
      ${null}         | ${true}  | ${'returns true if null'}
      ${{}}           | ${true}  | ${'returns true if {}'}
      ${[]}           | ${true}  | ${'returns true if []'}
      ${undefined}    | ${false} | ${'returns false if undefined'}
      ${{ value: 1 }} | ${false} | ${'returns false if { value: 1 }'}
      ${''}           | ${false} | ${'returns false if ""'}
      ${'test'}       | ${false} | ${'returns false if "test"'}
      ${1}            | ${false} | ${'returns false if 1'}
      ${0}            | ${false} | ${'returns false if 0'}
      ${true}         | ${false} | ${'returns false if true'}
      ${false}        | ${false} | ${'returns false if false'}
    `('$description', ({ obj, result }) => {
      expect(isNullAnswer(obj)).toStrictEqual(result);
    });
  });
  describe('isTextAnswer', () => {
    test.each`
      obj             | result   | description
      ${''}           | ${true}  | ${'returns true if ""'}
      ${'test'}       | ${true}  | ${'returns true if "test"'}
      ${null}         | ${false} | ${'returns false if null'}
      ${undefined}    | ${false} | ${'returns false if undefined'}
      ${{}}           | ${false} | ${'returns false if {}'}
      ${{ value: 1 }} | ${false} | ${'returns false if { value: 1 }'}
      ${[]}           | ${false} | ${'returns false if []'}
      ${1}            | ${false} | ${'returns false if 1'}
      ${0}            | ${false} | ${'returns false if 0'}
      ${true}         | ${false} | ${'returns false if true'}
      ${false}        | ${false} | ${'returns false if false'}
    `('$description', ({ obj, result }) => {
      expect(isTextAnswer(obj)).toStrictEqual(result);
    });
  });
});
