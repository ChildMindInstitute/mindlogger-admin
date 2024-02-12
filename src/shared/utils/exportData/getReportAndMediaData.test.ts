import { DecryptedAnswerData, UserActionType } from 'shared/types';
import {
  mockedDecryptedAnswersWithSubscales,
  mockedDecryptedEventsForDrawing,
  mockedDecryptedObjectForAudio,
  mockedDecryptedObjectForDrawing,
  mockedDecryptedObjectForPhoto,
  mockedDecryptedObjectForVideo,
  mockedParsedAnswers,
} from 'shared/mock';

import {
  getDecryptedAnswersObject,
  getReportData,
  getMediaData,
  getActivityJourneyData,
  checkIfHasGithubImportedEventScreen,
} from './getReportAndMediaData';
import { ItemResponseType } from '../../consts';
import { getObjectFromList } from '../getObjectFromList';

describe('getReportAndMediaData', () => {
  describe('getDecryptedAnswersObject', () => {
    const textItem = {
      activityId: 'activityId-1',
      activityItem: {
        id: 'itemId-1',
        name: 'itemName-1',
        responseType: ItemResponseType.Text,
      },
      answer: '1',
    };
    const multiItem = {
      activityId: 'activityId-1',
      activityItem: {
        id: 'itemId-2',
        name: 'itemName-2',
        responseType: ItemResponseType.MultipleSelection,
      },
      answer: '2',
    };
    const sliderItem = {
      activityId: 'activityId-1',
      activityItem: {
        id: 'itemId-3',
        name: 'itemName-3',
        responseType: ItemResponseType.Slider,
      },
      answer: '3',
    };
    const decryptedAnswers = [textItem, multiItem, sliderItem] as DecryptedAnswerData[];

    test('should return an object with the decrypted answers', () => {
      const result = getDecryptedAnswersObject({
        decryptedAnswers,
      });

      expect(result).toEqual({
        'activityId-1/itemId-1': textItem,
        'activityId-1/itemId-2': multiItem,
        'activityId-1/itemId-3': sliderItem,
      });
    });
    test('should return an object with the decrypted answers when has url event screen', () => {
      const result = getDecryptedAnswersObject({
        decryptedAnswers,
        hasUrlEventScreen: true,
      });

      expect(result).toEqual({
        'itemName-1': textItem,
        'itemName-2': multiItem,
        'itemName-3': sliderItem,
      });
    });
    test('should return an object with the decrypted answers when has migrated answers', () => {
      const textItemBeforeMigration = {
        ...textItem,
        activityId: '11c23b53-8819-c178-d236-685e00000000',
        activityItem: {
          ...textItem.activityItem,
          id: '64c23b53-8819-c178-d236-685100000000',
        },
      };
      const multiItemBeforeMigration = {
        ...multiItem,
        activityId: '11c23b53-8819-c178-d236-685e00000000',
        activityItem: {
          ...multiItem.activityItem,
          id: '64c23b53-8819-c178-d236-685200000000',
        },
      };
      const sliderItemBeforeMigration = {
        ...sliderItem,
        activityId: '11c23b53-8819-c178-d236-685e00000000',
        activityItem: {
          ...sliderItem.activityItem,
          id: '64c23b53-8819-c178-d236-685300000000',
        },
      };
      const decryptedAnswers = [
        textItemBeforeMigration,
        multiItemBeforeMigration,
        sliderItemBeforeMigration,
      ] as DecryptedAnswerData[];

      const result = getDecryptedAnswersObject({
        decryptedAnswers,
        hasMigratedAnswers: true,
      });

      expect(result).toEqual({
        '11c23b538819c178d236685e/64c23b538819c178d2366851': textItemBeforeMigration,
        '11c23b538819c178d236685e/64c23b538819c178d2366852': multiItemBeforeMigration,
        '11c23b538819c178d236685e/64c23b538819c178d2366853': sliderItemBeforeMigration,
      });
    });
  });
  describe('getReportData', () => {
    const textItem = {
      activityId: 'activityId-1',
      activityItem: {
        id: 'itemId-1',
        name: 'itemName-1',
        responseType: ItemResponseType.Text,
      },
      answer: '1',
    };
    const textNullAnswerItem = {
      ...textItem,
      answer: null,
      activityItem: {
        ...textItem.activityItem,
        id: 'itemId-2',
        name: 'itemName-2',
      },
    };
    const textUndefinedAnswerItem = {
      ...textItem,
      answer: undefined,
      activityItem: {
        ...textItem.activityItem,
        id: 'itemId-3',
        name: 'itemName-3',
      },
    };
    const decryptedAnswers = [textItem, textNullAnswerItem, textUndefinedAnswerItem] as DecryptedAnswerData[];
    const rawAnswersObject = getObjectFromList(decryptedAnswers, (item) => item.activityItem.name);

    test('should return filtered out array with items without empty answers', () => {
      //eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const result = getReportData([], rawAnswersObject, decryptedAnswers);
      expect(result).toEqual([
        {
          id: undefined,
          activity_scheduled_time: 'not scheduled',
          activity_start_time: 'NaN',
          activity_end_time: 'NaN',
          flag: 'completed',
          secret_user_id: undefined,
          userId: undefined,
          activity_id: 'activityId-1',
          activity_name: undefined,
          activity_flow: undefined,
          item: 'itemName-1',
          response: '1',
          prompt: '',
          options: '',
          version: undefined,
          rawScore: '',
          reviewing_id: undefined,
        },
      ]);
    });
    test('should return an array with items', () => {
      const { decryptedAnswers } = mockedParsedAnswers[0];
      const rawAnswersObject = getObjectFromList(decryptedAnswers, (item) => item.activityItem.name);
      //eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const result = getReportData([], rawAnswersObject, decryptedAnswers);
      expect(result).toEqual([
        {
          activity_end_time: '1689764605250.957',
          activity_flow: null,
          activity_id: '39cc3d0f-8a82-462c-946f-61dcee6cbe1a',
          activity_name: 'New Activity#Single_Multi_Slider - Assessment',
          activity_scheduled_time: '1689764371123',
          activity_start_time: '1689764605250.957',
          flag: 'completed',
          id: '09b0cac4-303a-4ce9-94bd-dff922c24947',
          item: 'single',
          options: 'Opt1: 0, Opt2: 1, Opt3: 2',
          prompt: 'single',
          rawScore: '',
          response: 'value: 0',
          reviewing_id: 'c482d1fd-5b0f-4cae-b10d-77cbb4151386',
          secret_user_id: '[admin account] (ml_test1_account@gmail.com)',
          userId: '0e6d026f-b382-4022-9208-74a54768ea81',
          version: '2.1.0',
        },
        {
          activity_end_time: '1689764605250.957',
          activity_flow: null,
          activity_id: '39cc3d0f-8a82-462c-946f-61dcee6cbe1a',
          activity_name: 'New Activity#Single_Multi_Slider - Assessment',
          activity_scheduled_time: '1689764371123',
          activity_start_time: '1689764605250.957',
          flag: 'completed',
          id: '09b0cac4-303a-4ce9-94bd-dff922c24947',
          item: 'multi',
          options: 'Opt1: 0, Opt2: 1, Opt3: 2',
          prompt: 'multi',
          rawScore: '',
          response: 'value: 0',
          reviewing_id: 'c482d1fd-5b0f-4cae-b10d-77cbb4151386',
          secret_user_id: '[admin account] (ml_test1_account@gmail.com)',
          userId: '0e6d026f-b382-4022-9208-74a54768ea81',
          version: '2.1.0',
        },
        {
          activity_end_time: '1689764605250.957',
          activity_flow: null,
          activity_id: '39cc3d0f-8a82-462c-946f-61dcee6cbe1a',
          activity_name: 'New Activity#Single_Multi_Slider - Assessment',
          activity_scheduled_time: '1689764371123',
          activity_start_time: '1689764605250.957',
          flag: 'completed',
          id: '09b0cac4-303a-4ce9-94bd-dff922c24947',
          item: 'slider',
          options: '0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5',
          prompt: 'slider',
          rawScore: '',
          response: 'value: 5',
          reviewing_id: 'c482d1fd-5b0f-4cae-b10d-77cbb4151386',
          secret_user_id: '[admin account] (ml_test1_account@gmail.com)',
          userId: '0e6d026f-b382-4022-9208-74a54768ea81',
          version: '2.1.0',
        },
      ]);
    });
    test('should return an array with items and subscale calculation in first item', () => {
      const rawAnswersObject = getObjectFromList(mockedDecryptedAnswersWithSubscales, (item) => item.activityItem.name);
      //eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const result = getReportData([], rawAnswersObject, mockedDecryptedAnswersWithSubscales);
      expect(result).toEqual([
        {
          'Final SubScale Score': 5,
          'Optional text for Final SubScale Score': 'Description #2 for range 4~20',
          activity_end_time: '1698673935278',
          activity_flow: null,
          activity_id: 'eb521f27-5ccb-4286-97ce-704793294015',
          activity_name: 'New Activity#SimpleItems-3 (No skippable)',
          activity_scheduled_time: 'not scheduled',
          activity_start_time: '1698673918439',
          flag: 'completed',
          id: '8daa8ec9-7c54-4a51-a87f-f5a14b1294d3',
          item: 'single',
          options: 'Opt1: 0 (score: 3), Opt2: 1 (score: 5), Opt3: 2 (score: 1)',
          prompt: 'single',
          rawScore: 9,
          response: 'value: 2',
          reviewing_id: null,
          secret_user_id: 'respondentSecretId',
          'ss-1': 5,
          'ss-2': 6,
          userId: '835e5277-5949-4dff-817a-d85c17a3604f',
          version: '1.2.0',
        },
        {
          activity_end_time: '1698673935278',
          activity_flow: null,
          activity_id: 'eb521f27-5ccb-4286-97ce-704793294015',
          activity_name: 'New Activity#SimpleItems-3 (No skippable)',
          activity_scheduled_time: 'not scheduled',
          activity_start_time: '1698673918439',
          flag: 'completed',
          id: '8daa8ec9-7c54-4a51-a87f-f5a14b1294d3',
          item: 'multi',
          options: 'Opt1: 0 (score: 1), Opt2: 1 (score: 3), Opt3: 2 (score: 0)',
          prompt: 'multi',
          rawScore: 4,
          response: 'value: 0',
          reviewing_id: null,
          secret_user_id: 'respondentSecretId',
          userId: '835e5277-5949-4dff-817a-d85c17a3604f',
          version: '1.2.0',
        },
        {
          activity_end_time: '1698673935278',
          activity_flow: null,
          activity_id: 'eb521f27-5ccb-4286-97ce-704793294015',
          activity_name: 'New Activity#SimpleItems-3 (No skippable)',
          activity_scheduled_time: 'not scheduled',
          activity_start_time: '1698673918439',
          flag: 'completed',
          id: '8daa8ec9-7c54-4a51-a87f-f5a14b1294d3',
          item: 'slider',
          options:
            '0: 0 (score: 1), 1: 1 (score: 2), 2: 2 (score: 3), 3: 3 (score: 4), 4: 4 (score: 5), 5: 5 (score: 6)',
          prompt: 'slider',
          rawScore: 21,
          response: 'value: 2',
          reviewing_id: null,
          secret_user_id: 'respondentSecretId',
          userId: '835e5277-5949-4dff-817a-d85c17a3604f',
          version: '1.2.0',
        },
        {
          activity_end_time: '1698673935278',
          activity_flow: null,
          activity_id: 'eb521f27-5ccb-4286-97ce-704793294015',
          activity_name: 'New Activity#SimpleItems-3 (No skippable)',
          activity_scheduled_time: 'not scheduled',
          activity_start_time: '1698673918439',
          flag: 'completed',
          id: '8daa8ec9-7c54-4a51-a87f-f5a14b1294d3',
          item: 'gender_screen',
          options: 'Male: 0, Female: 1',
          prompt: 'How do you describe yourself?',
          rawScore: '',
          response: 'value: 0',
          reviewing_id: null,
          secret_user_id: 'respondentSecretId',
          userId: '835e5277-5949-4dff-817a-d85c17a3604f',
          version: '1.2.0',
        },
        {
          activity_end_time: '1698673935278',
          activity_flow: null,
          activity_id: 'eb521f27-5ccb-4286-97ce-704793294015',
          activity_name: 'New Activity#SimpleItems-3 (No skippable)',
          activity_scheduled_time: 'not scheduled',
          activity_start_time: '1698673918439',
          flag: 'completed',
          id: '8daa8ec9-7c54-4a51-a87f-f5a14b1294d3',
          item: 'age_screen',
          options: '',
          prompt: 'How old are you?',
          rawScore: '',
          response: '25',
          reviewing_id: null,
          secret_user_id: 'respondentSecretId',
          userId: '835e5277-5949-4dff-817a-d85c17a3604f',
          version: '1.2.0',
        },
      ]);
    });
  });
  describe('getMediaData', () => {
    const answersForRegularItems = mockedParsedAnswers[0].decryptedAnswers;
    const resultForDrawing = {
      fileName: 'eabe2de0-9ea4-495b-a4d1-2966eece97f8-835e5277-5949-4dff-817a-d85c17a3604f-drawing.svg',
      url: 'https://media-dev.cmiml.net/mindlogger/2048412251058983019/023cf7e7-6083-443a-b74a-f32b75a711cd/e2e611df-02d5-4316-8406-c5d685b94090.svg',
    };
    const resultForPhoto = {
      fileName: '949f248c-1a4b-4a35-a5a2-898dfef72050-835e5277-5949-4dff-817a-d85c17a3604f-photo_text.jpg',
      url: 'https://media-dev.cmiml.net/mindlogger/2048412251058983019/d595acfc-8322-4d45-8ba5-c2f793b5476e/rn_image_picker_lib_temp_46ecc18c-2c7d-4d72-8d27-636c37e2e6f3.jpg',
    };
    const resultForVideo = {
      fileName: '949f248c-1a4b-4a35-a5a2-898dfef72050-835e5277-5949-4dff-817a-d85c17a3604f-video_text.mp4',
      url: 'https://media-dev.cmiml.net/mindlogger/2048412251058983019/4fc51edd-2dab-4048-836b-f1b9bf0270f6/rn_image_picker_lib_temp_9309b1eb-90b0-4908-a24d-be6fa06def10.mp4',
    };
    const resultForAudio = {
      fileName: '949f248c-1a4b-4a35-a5a2-898dfef72050-835e5277-5949-4dff-817a-d85c17a3604f-audio_text.m4a',
      url: 'https://media-dev.cmiml.net/mindlogger/2048412251058983019/73ef3a61-8053-4558-814e-05baafbbdc90/f01c225c-62df-4867-b282-66f585a65109.m4a',
    };

    test.each`
      decryptedAnswers                     | expected              | description
      ${answersForRegularItems}            | ${[]}                 | ${'should return an empty array for regular items'}
      ${[mockedDecryptedObjectForDrawing]} | ${[resultForDrawing]} | ${'should return an media data for drawing'}
      ${[mockedDecryptedObjectForPhoto]}   | ${[resultForPhoto]}   | ${'should return an media data for photo'}
      ${[mockedDecryptedObjectForVideo]}   | ${[resultForVideo]}   | ${'should return an media data for video'}
      ${[mockedDecryptedObjectForAudio]}   | ${[resultForAudio]}   | ${'should return an media data for audio'}
    `('$description', ({ decryptedAnswers, expected }) => {
      //eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const result = getMediaData([], decryptedAnswers);
      expect(result).toEqual(expected);
    });
  });
  describe('getActivityJourneyData', () => {
    test('should return an array for journey data', () => {
      const decryptedAnswers = [mockedDecryptedObjectForDrawing];
      const rawAnswersObject = getObjectFromList(decryptedAnswers, (item) => item.activityItem.name);
      const result = getActivityJourneyData(
        [],
        //eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        rawAnswersObject,
        decryptedAnswers,
        mockedDecryptedEventsForDrawing,
      );
      expect(result).toEqual([
        {
          activity_end_time: '1689770404000',
          activity_flow: null,
          activity_id: '16d2c8e5-8541-4b7f-b598-6a310caee5f5',
          activity_name: 'New Activity#Drawing-item2',
          activity_scheduled_time: 'not scheduled',
          activity_start_time: '1689770351000',
          id: 'eabe2de0-9ea4-495b-a4d1-2966eece97f8',
          item: 'drawing',
          options: '',
          press_back_time: '',
          press_done_time: '',
          press_next_time: '',
          press_skip_time: '',
          press_undo_time: '',
          prompt: 'drawing\n',
          response: 'eabe2de0-9ea4-495b-a4d1-2966eece97f8-835e5277-5949-4dff-817a-d85c17a3604f-drawing.svg',
          response_option_selection_time: '1689770402756',
          secret_user_id: 'respondentSecretId',
          user_id: '835e5277-5949-4dff-817a-d85c17a3604f',
          version: '1.1.1',
        },
        {
          activity_end_time: '1689770404000',
          activity_flow: null,
          activity_id: '16d2c8e5-8541-4b7f-b598-6a310caee5f5',
          activity_name: 'New Activity#Drawing-item2',
          activity_scheduled_time: 'not scheduled',
          activity_start_time: '1689770351000',
          id: 'eabe2de0-9ea4-495b-a4d1-2966eece97f8',
          item: 'drawing',
          options: '',
          press_back_time: '',
          press_done_time: '1689770404752',
          press_next_time: '',
          press_skip_time: '',
          press_undo_time: '',
          prompt: 'drawing\n',
          response: '',
          response_option_selection_time: '',
          secret_user_id: 'respondentSecretId',
          user_id: '835e5277-5949-4dff-817a-d85c17a3604f',
          version: '1.1.1',
        },
      ]);
    });
    test('should return an array for journey data with splash screen', () => {
      const decryptedAnswers = [mockedDecryptedObjectForDrawing];
      const rawAnswersObject = getObjectFromList(decryptedAnswers, (item) => item.activityItem.name);
      const events = [
        {
          type: 'NEXT',
          screen: '16d2c8e5-8541-4b7f-b598-6a310caee5f5',
          time: 1689770402755,
        },
        ...mockedDecryptedEventsForDrawing,
      ];
      const result = getActivityJourneyData(
        [],
        //eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        rawAnswersObject,
        decryptedAnswers,
        events,
      );
      expect(result).toEqual([
        {
          activity_end_time: '1689770404000',
          activity_flow: null,
          activity_id: '16d2c8e5-8541-4b7f-b598-6a310caee5f5',
          activity_name: 'New Activity#Drawing-item2',
          activity_scheduled_time: 'not scheduled',
          activity_start_time: '1689770351000',
          id: 'eabe2de0-9ea4-495b-a4d1-2966eece97f8',
          item: 'Splash Screen',
          options: '',
          press_back_time: '',
          press_done_time: '',
          press_next_time: '1689770402755',
          press_skip_time: '',
          press_undo_time: '',
          prompt: '',
          response: '',
          response_option_selection_time: '',
          secret_user_id: 'respondentSecretId',
          user_id: '835e5277-5949-4dff-817a-d85c17a3604f',
          version: '1.1.1',
        },
        {
          activity_end_time: '1689770404000',
          activity_flow: null,
          activity_id: '16d2c8e5-8541-4b7f-b598-6a310caee5f5',
          activity_name: 'New Activity#Drawing-item2',
          activity_scheduled_time: 'not scheduled',
          activity_start_time: '1689770351000',
          id: 'eabe2de0-9ea4-495b-a4d1-2966eece97f8',
          item: 'drawing',
          options: '',
          press_back_time: '',
          press_done_time: '',
          press_next_time: '',
          press_skip_time: '',
          press_undo_time: '',
          prompt: 'drawing\n',
          response: 'eabe2de0-9ea4-495b-a4d1-2966eece97f8-835e5277-5949-4dff-817a-d85c17a3604f-drawing.svg',
          response_option_selection_time: '1689770402756',
          secret_user_id: 'respondentSecretId',
          user_id: '835e5277-5949-4dff-817a-d85c17a3604f',
          version: '1.1.1',
        },
        {
          activity_end_time: '1689770404000',
          activity_flow: null,
          activity_id: '16d2c8e5-8541-4b7f-b598-6a310caee5f5',
          activity_name: 'New Activity#Drawing-item2',
          activity_scheduled_time: 'not scheduled',
          activity_start_time: '1689770351000',
          id: 'eabe2de0-9ea4-495b-a4d1-2966eece97f8',
          item: 'drawing',
          options: '',
          press_back_time: '',
          press_done_time: '1689770404752',
          press_next_time: '',
          press_skip_time: '',
          press_undo_time: '',
          prompt: 'drawing\n',
          response: '',
          response_option_selection_time: '',
          secret_user_id: 'respondentSecretId',
          user_id: '835e5277-5949-4dff-817a-d85c17a3604f',
          version: '1.1.1',
        },
      ]);
    });
  });
  describe('checkIfHasGithubImportedEventScreen', () => {
    const decryptedEventsWithItemImportedFromGithub = [
      {
        type: UserActionType.Next,
        screen:
          'https://raw.githubusercontent.com/ChildMindInstitute/NIMH_EMA_applet/master/activities/<activity_name>/items/<item_name>',
        time: 1689770402755,
      },
    ];
    test.each`
      decryptedEvents                              | expected | description
      ${mockedDecryptedEventsForDrawing}           | ${false} | ${'should return false for regular items'}
      ${decryptedEventsWithItemImportedFromGithub} | ${true}  | ${'should return true for applet with items imported from github'}
    `('$description', ({ decryptedEvents, expected }) => {
      const result = checkIfHasGithubImportedEventScreen(decryptedEvents);
      expect(result).toBe(expected);
    });
  });
});
