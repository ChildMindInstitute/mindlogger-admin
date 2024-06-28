/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { prepareData } from './prepareData';
import * as getParsedAnswersFunctions from '../getParsedAnswers';
import { mockedParsedAnswers } from '../../mock';

describe('prepareData', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return an object with the correct keys', async () => {
    const data = { activities: [], answers: [] };
    const getDecryptedAnswers = jest.fn();
    const result = await prepareData(data, getDecryptedAnswers);
    expect(result).toHaveProperty('reportData');
    expect(result).toHaveProperty('activityJourneyData');
    expect(result).toHaveProperty('mediaData');
    expect(result).toHaveProperty('drawingItemsData');
    expect(result).toHaveProperty('stabilityTrackerItemsData');
    expect(result).toHaveProperty('abTrailsItemsData');
    expect(result).toHaveProperty('flankerItemsData');
    expect(result.reportData).toEqual([]);
    expect(result.activityJourneyData).toEqual([]);
    expect(result.mediaData).toEqual([]);
    expect(result.drawingItemsData).toEqual([]);
    expect(result.stabilityTrackerItemsData).toEqual([]);
    expect(result.abTrailsItemsData).toEqual([]);
    expect(result.flankerItemsData).toEqual([]);
  });
  test('should return filled in reportData', async () => {
    const data = {
      answers: [
        {
          id: '09b0cac4-303a-4ce9-94bd-dff922c24947',
          submitId: '9a3a04b9-a5e9-420b-9daf-17156523658d',
          version: '2.1.0',
          respondentId: '0e6d026f-b382-4022-9208-74a54768ea81',
          respondentSecretId: '[admin account] (ml_test1_account@gmail.com)',
          legacyProfileId: null,
          userPublicKey: '0e6d026f-b382-4022-9208-74a54768ea81',
          answer:
            '511c5c6bcec55bd5656a9f46e7f98831:841776a164076b52a0486839bb3ff4c67ac6619459714c4a9b9f73ad316aa5bc596241c5f8082eccd1df06d0dad268dc62be4b7c8e216e5e70118b04a88c710d27306d36eabd144b32215449853dc23c',
          itemIds: [
            '5470cf91-76bf-48b4-b3da-4a615313c257',
            'dd9c96ad-b57c-4440-b284-27c7f1351fd0',
            'ab47ab74-1ae5-475b-b1cb-bc868ead793f',
          ],
          events: null,
          scheduledDatetime: 1689764371.123,
          startDatetime: 1689764605.250957,
          endDatetime: 1689764605.250957,
          migratedDate: null,
          appletHistoryId: 'f7283dca-97c0-4953-92c1-e6df8190f9ad_2.1.0',
          activityHistoryId: '39cc3d0f-8a82-462c-946f-61dcee6cbe1a_2.1.0',
          flowHistoryId: null,
          flowName: null,
          reviewedAnswerId: 'c482d1fd-5b0f-4cae-b10d-77cbb4151386',
          createdAt: '2023-07-19T11:03:25.250957',
          migratedData: null,
          appletId: 'f7283dca-97c0-4953-92c1-e6df8190f9ad',
          activityId: '39cc3d0f-8a82-462c-946f-61dcee6cbe1a',
          flowId: null,
        },
      ],
      activities: [
        {
          name: 'New Activity#Single_Multi_Slider - Assessment',
          description: '',
          splashScreen: '',
          image: '',
          showAllAtOnce: false,
          isSkippable: false,
          isReviewable: true,
          responseIsEditable: true,
          isHidden: false,
          scoresAndReports: null,
          subscaleSetting: null,
          reportIncludedItemName: null,
          id: '39cc3d0f-8a82-462c-946f-61dcee6cbe1a',
          idVersion: '39cc3d0f-8a82-462c-946f-61dcee6cbe1a_2.1.0',
          version: '2.1.0',
          createdAt: '2023-07-19T10:48:10.529133',
          isPerformanceTask: false,
          performanceTaskType: null,
          items: [
            {
              question: 'single',
              responseType: 'singleSelect',
              responseValues: {
                paletteName: null,
                options: [
                  {
                    id: 'fbb48a19-3ea6-4999-ac1c-5852a75c1d8a',
                    text: 'opt1',
                    image: null,
                    score: null,
                    tooltip: null,
                    isHidden: false,
                    color: null,
                    alert: null,
                    value: 0,
                  },
                  {
                    id: '3ffd3440-1438-44a0-9965-b6c70978d5c3',
                    text: 'opt2',
                    image: null,
                    score: null,
                    tooltip: null,
                    isHidden: false,
                    color: null,
                    alert: null,
                    value: 1,
                  },
                  {
                    id: '081fc595-dfc7-41b9-ad72-c4242305d7cb',
                    text: 'opt3',
                    image: null,
                    score: null,
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
                addScores: false,
                setAlerts: false,
                addTooltip: false,
                setPalette: false,
                addTokens: null,
                additionalResponseOption: {
                  textInputOption: false,
                  textInputRequired: false,
                },
              },
              name: 'single',
              isHidden: false,
              conditionalLogic: null,
              allowEdit: true,
              id: '5470cf91-76bf-48b4-b3da-4a615313c257',
            },
            {
              question: 'multi',
              responseType: 'multiSelect',
              responseValues: {
                paletteName: null,
                options: [
                  {
                    id: '0f4776b3-5dd2-4c72-92af-474ca9b956f2',
                    text: 'opt1',
                    image: null,
                    score: null,
                    tooltip: null,
                    isHidden: false,
                    color: null,
                    alert: null,
                    value: 0,
                  },
                  {
                    id: '4c03f3a4-d239-4707-a962-08d49a4f145b',
                    text: 'opt2',
                    image: null,
                    score: null,
                    tooltip: null,
                    isHidden: false,
                    color: null,
                    alert: null,
                    value: 1,
                  },
                  {
                    id: 'ad8ba486-9b4d-4133-8d78-cbffd070e5d6',
                    text: 'opt3',
                    image: null,
                    score: null,
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
                addScores: false,
                setAlerts: false,
                addTooltip: false,
                setPalette: false,
                addTokens: null,
                additionalResponseOption: {
                  textInputOption: false,
                  textInputRequired: false,
                },
              },
              name: 'multi',
              isHidden: false,
              conditionalLogic: null,
              allowEdit: true,
              id: 'dd9c96ad-b57c-4440-b284-27c7f1351fd0',
            },
            {
              question: 'slider',
              responseType: 'slider',
              responseValues: {
                minLabel: 'min',
                maxLabel: 'max',
                minValue: 0,
                maxValue: 5,
                minImage: null,
                maxImage: null,
                scores: null,
                alerts: null,
              },
              config: {
                removeBackButton: false,
                skippableItem: false,
                addScores: false,
                setAlerts: false,
                additionalResponseOption: {
                  textInputOption: false,
                  textInputRequired: false,
                },
                showTickMarks: false,
                showTickLabels: false,
                continuousSlider: false,
                timer: 0,
              },
              name: 'slider',
              isHidden: false,
              conditionalLogic: null,
              allowEdit: true,
              id: 'ab47ab74-1ae5-475b-b1cb-bc868ead793f',
            },
          ],
        },
      ],
    };
    const getDecryptedAnswers = jest.fn();
    jest
      .spyOn(getParsedAnswersFunctions, 'getParsedAnswers')
      .mockImplementationOnce(() => mockedParsedAnswers);

    const result = await prepareData(data, getDecryptedAnswers);
    expect(result).toEqual({
      reportData: [
        {
          id: '09b0cac4-303a-4ce9-94bd-dff922c24947',
          activity_flow_submission_id: '',
          activity_scheduled_time: '1689764371123',
          activity_start_time: '1689764605250.957',
          activity_end_time: '1689764605250.957',
          flag: 'completed',
          secret_user_id: '[admin account] (ml_test1_account@gmail.com)',
          userId: '0e6d026f-b382-4022-9208-74a54768ea81',
          activity_id: '39cc3d0f-8a82-462c-946f-61dcee6cbe1a',
          activity_name: 'New Activity#Single_Multi_Slider - Assessment',
          activity_flow_id: '',
          activity_flow_name: '',
          item: 'single',
          item_id: '5470cf91-76bf-48b4-b3da-4a615313c257',
          response: 'value: 0',
          prompt: 'single',
          options: 'Opt1: 0, Opt2: 1, Opt3: 2',
          version: '2.1.0',
          rawScore: '',
          reviewing_id: 'c482d1fd-5b0f-4cae-b10d-77cbb4151386',
          event_id: '',
          timezone_offset: '',
        },
        {
          id: '09b0cac4-303a-4ce9-94bd-dff922c24947',
          activity_flow_submission_id: '',
          activity_scheduled_time: '1689764371123',
          activity_start_time: '1689764605250.957',
          activity_end_time: '1689764605250.957',
          flag: 'completed',
          secret_user_id: '[admin account] (ml_test1_account@gmail.com)',
          userId: '0e6d026f-b382-4022-9208-74a54768ea81',
          activity_id: '39cc3d0f-8a82-462c-946f-61dcee6cbe1a',
          activity_name: 'New Activity#Single_Multi_Slider - Assessment',
          activity_flow_id: '',
          activity_flow_name: '',
          item: 'multi',
          item_id: 'dd9c96ad-b57c-4440-b284-27c7f1351fd0',
          response: 'value: 0',
          prompt: 'multi',
          options: 'Opt1: 0, Opt2: 1, Opt3: 2',
          version: '2.1.0',
          rawScore: '',
          reviewing_id: 'c482d1fd-5b0f-4cae-b10d-77cbb4151386',
          event_id: '',
          timezone_offset: '',
        },
        {
          id: '09b0cac4-303a-4ce9-94bd-dff922c24947',
          activity_flow_submission_id: '',
          activity_scheduled_time: '1689764371123',
          activity_start_time: '1689764605250.957',
          activity_end_time: '1689764605250.957',
          flag: 'completed',
          secret_user_id: '[admin account] (ml_test1_account@gmail.com)',
          userId: '0e6d026f-b382-4022-9208-74a54768ea81',
          activity_id: '39cc3d0f-8a82-462c-946f-61dcee6cbe1a',
          activity_name: 'New Activity#Single_Multi_Slider - Assessment',
          activity_flow_id: '',
          activity_flow_name: '',
          item: 'slider',
          item_id: 'ab47ab74-1ae5-475b-b1cb-bc868ead793f',
          response: 'value: 5',
          prompt: 'slider',
          options: '0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5',
          version: '2.1.0',
          rawScore: '',
          reviewing_id: 'c482d1fd-5b0f-4cae-b10d-77cbb4151386',
          event_id: '',
          timezone_offset: '',
        },
      ],
      activityJourneyData: [],
      mediaData: [],
      drawingItemsData: [],
      stabilityTrackerItemsData: [],
      abTrailsItemsData: [],
      flankerItemsData: [],
    });
  });
});
