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
  checkIfHasGithubImportedEventScreen,
  getActivityJourneyData,
  getDecryptedAnswersObject,
  getMediaData,
  getReportData,
} from './getReportAndMediaData';
import { ItemResponseType } from '../../consts';
import { getObjectFromList } from '../getObjectFromList';

describe('getReportAndMediaData', () => {
  describe('getDecryptedAnswersObject', () => {
    const textItem = {
      activityId: 'activityId-1',
      activityName: 'activity_name',
      activityItem: {
        id: 'itemId-1',
        name: 'itemName-1',
        responseType: ItemResponseType.Text,
      },
      answer: '1',
    };
    const multiItem = {
      activityId: 'activityId-1',
      activityName: 'activity_name',
      activityItem: {
        id: 'itemId-2',
        name: 'itemName-2',
        responseType: ItemResponseType.MultipleSelection,
      },
      answer: '2',
    };
    const sliderItem = {
      activityId: 'activityId-1',
      activityName: 'activity_name',
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
      activityName: 'activity_name',
      activityItem: {
        id: 'itemId-1',
        name: 'itemName-1',
        responseType: ItemResponseType.Text,
      },
      answer: '1',
      sourceSubjectId: 'bba7bcd3-f245-4354-9461-b494f186dcca',
      sourceSecretId: 'source-secret-id',
      sourceUserNickname: 'Mock source user',
      sourceUserTag: 'Mock Tag',
      relation: 'admin',
      targetSubjectId: '116d59c1-2bb5-405b-8503-cb6c1e6b7620',
      targetSecretId: 'target-secret-id',
      targetUserNickname: 'Mock target user',
      targetUserTag: 'Mock Tag',
      inputSubjectId: '0a7544d8-bae2-4ed9-9e83-80401e537cd9',
      inputSecretId: 'input-secret-id',
      inputUserNickname: 'Mock input user',
    };
    const textNullAnswerItem = {
      ...textItem,
      answer: null,
      activityItem: {
        ...textItem.activityItem,
        id: 'itemId-2',
        name: 'itemName-2',
      },
      sourceSubjectId: 'bba7bcd3-f245-4354-9461-b494f186dcca',
      sourceSecretId: 'source-secret-id',
      sourceUserNickname: 'Mock source user',
      sourceUserTag: 'Mock Tag',
      relation: 'admin',
      targetSubjectId: '116d59c1-2bb5-405b-8503-cb6c1e6b7620',
      targetSecretId: 'target-secret-id',
      targetUserNickname: 'Mock target user',
      targetUserTag: 'Mock Tag',
      inputSubjectId: '0a7544d8-bae2-4ed9-9e83-80401e537cd9',
      inputSecretId: 'input-secret-id',
      inputUserNickname: 'Mock input user',
    };
    const textUndefinedAnswerItem = {
      ...textItem,
      answer: undefined,
      activityItem: {
        ...textItem.activityItem,
        id: 'itemId-3',
        name: 'itemName-3',
      },
      sourceSubjectId: 'bba7bcd3-f245-4354-9461-b494f186dcca',
      sourceSecretId: 'source-secret-id',
      sourceUserNickname: 'Mock source user',
      sourceUserTag: 'Mock Tag',
      relation: 'admin',
      targetSubjectId: '116d59c1-2bb5-405b-8503-cb6c1e6b7620',
      targetSecretId: 'target-secret-id',
      targetUserNickname: 'Mock target user',
      targetUserTag: 'Mock Tag',
      inputSubjectId: '0a7544d8-bae2-4ed9-9e83-80401e537cd9',
      inputSecretId: 'input-secret-id',
      inputUserNickname: 'Mock input user',
    };
    const decryptedAnswers = [
      textItem,
      textNullAnswerItem,
      textUndefinedAnswerItem,
    ] as DecryptedAnswerData[];
    const rawAnswersObject = getObjectFromList(decryptedAnswers, (item) => item.activityItem.name);

    test('should return empty list when an ABTrails answer was skipped at once', () => {
      const decryptedAbTrailsItem = {
        activityItem: {
          question: '',
          responseType: 'ABTrails',
          responseValues: null,
          config: {
            deviceType: 'mobile',
            orderName: 'first',
            tutorials: {
              tutorials: [], // skipped for the test case
            },
            nodes: {
              radius: 4.18,
              fontSize: 5.6,
              fontSizeBeginEnd: null,
              beginWordLength: null,
              endWordLength: null,
              nodes: [], // skipped for the test case
            },
          },
          name: 'ABTrails_mobile_1',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: false,
          id: 'ef510597-821a-444b-bf99-ae4d3c847866',
        },
        answer: null,
        id: '72b3985c-4352-4a9d-9c23-2455cc607781',
        submitId: '7b10bb4e-19a4-437c-a284-adcd6f5559ed',
        version: '1.1.0',
        respondentId: '835e5277-5949-4dff-817a-d85c17a3604f',
        respondentSecretId: 'ml_test1_account@gmail.com',
        legacyProfileId: null,
        scheduledDatetime: null,
        startDatetime: 1689928536,
        endDatetime: 1689928679,
        migratedDate: null,
        tzOffset: null,
        scheduledEventId: null,
        appletHistoryId: '3c32e00a-70c8-4f97-b549-5b536e9f8719_1.1.0',
        activityHistoryId: '160adf2b-0a69-46fd-8326-fb53ed77eb27_1.1.0',
        flowHistoryId: null,
        flowName: null,
        reviewedAnswerId: null,
        createdAt: '2023-07-21T08:38:08.324411',
        client: null,
        appletId: '3c32e00a-70c8-4f97-b549-5b536e9f8719',
        activityId: '160adf2b-0a69-46fd-8326-fb53ed77eb27',
        flowId: null,
        items: [], // skipped for the test case
        activityName: 'A/B Trails Mobile',
        subscaleSetting: null,
      };
      const decryptedAnswers = [decryptedAbTrailsItem] as unknown as DecryptedAnswerData[];
      const rawAnswersObject = getObjectFromList(
        decryptedAnswers,
        (item) => item.activityItem.name,
      );
      //eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const result = getReportData([], rawAnswersObject, decryptedAnswers);
      expect(result).toStrictEqual([]);
    });

    test('should return filtered out array with items without empty answers', () => {
      //eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const result = getReportData([], rawAnswersObject, decryptedAnswers);
      expect(result).toEqual([
        {
          id: undefined,
          activity_flow_submission_id: '',
          activity_scheduled_time: 'not scheduled',
          activity_start_time: 'NaN',
          activity_end_time: 'NaN',
          flag: 'completed',
          secret_user_id: '',
          user_id: '',
          source_user_subject_id: 'bba7bcd3-f245-4354-9461-b494f186dcca',
          source_user_secret_id: 'source-secret-id',
          source_user_nickname: 'Mock source user',
          source_user_relation: 'admin',
          source_user_tag: 'Mock Tag',
          target_user_subject_id: '116d59c1-2bb5-405b-8503-cb6c1e6b7620',
          target_user_secret_id: 'target-secret-id',
          target_user_nickname: 'Mock target user',
          target_user_tag: 'Mock Tag',
          input_user_subject_id: '0a7544d8-bae2-4ed9-9e83-80401e537cd9',
          input_user_secret_id: 'input-secret-id',
          input_user_nickname: 'Mock input user',
          activity_id: 'activityId-1',
          activity_name: 'activity_name',
          activity_flow_id: '',
          activity_flow_name: '',
          item: 'itemName-1',
          item_id: 'itemId-1',
          response: '1',
          prompt: '',
          options: '',
          version: '',
          rawScore: '',
          reviewing_id: '',
          event_id: '',
          timezone_offset: '',
        },
      ]);
    });
    test('should return an array with items', () => {
      const { decryptedAnswers } = mockedParsedAnswers[0];
      const rawAnswersObject = getObjectFromList(
        decryptedAnswers,
        (item) => item.activityItem.name,
      );
      //eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const result = getReportData([], rawAnswersObject, decryptedAnswers);
      expect(result).toEqual([
        {
          activity_flow_submission_id: '',
          activity_end_time: '1689764605250.957',
          activity_id: '39cc3d0f-8a82-462c-946f-61dcee6cbe1a',
          activity_name: 'New Activity#Single_Multi_Slider - Assessment',
          activity_flow_id: '',
          activity_flow_name: '',
          activity_scheduled_time: '1689764371123',
          activity_start_time: '1689764605250.957',
          flag: 'completed',
          id: '09b0cac4-303a-4ce9-94bd-dff922c24947',
          item: 'single',
          item_id: '5470cf91-76bf-48b4-b3da-4a615313c257',
          options: 'Opt1: 0, Opt2: 1, Opt3: 2',
          prompt: 'single',
          rawScore: '',
          response: 'value: 0',
          reviewing_id: 'c482d1fd-5b0f-4cae-b10d-77cbb4151386',
          secret_user_id: '[admin account] (ml_test1_account@gmail.com)',
          user_id: '0e6d026f-b382-4022-9208-74a54768ea81',
          source_user_subject_id: 'bba7bcd3-f245-4354-9461-b494f186dcca',
          source_user_secret_id: 'source-secret-id',
          source_user_nickname: 'Mock source user',
          source_user_relation: 'admin',
          source_user_tag: 'Mock Tag',
          target_user_subject_id: '116d59c1-2bb5-405b-8503-cb6c1e6b7620',
          target_user_secret_id: 'target-secret-id',
          target_user_nickname: 'Mock target user',
          target_user_tag: 'Mock Tag',
          input_user_subject_id: '0a7544d8-bae2-4ed9-9e83-80401e537cd9',
          input_user_secret_id: 'input-secret-id',
          input_user_nickname: 'Mock input user',
          version: '2.1.0',
          event_id: '',
          timezone_offset: '',
        },
        {
          activity_flow_submission_id: '',
          activity_end_time: '1689764605250.957',
          activity_id: '39cc3d0f-8a82-462c-946f-61dcee6cbe1a',
          activity_name: 'New Activity#Single_Multi_Slider - Assessment',
          activity_flow_id: '',
          activity_flow_name: '',
          activity_scheduled_time: '1689764371123',
          activity_start_time: '1689764605250.957',
          flag: 'completed',
          id: '09b0cac4-303a-4ce9-94bd-dff922c24947',
          item: 'multi',
          item_id: 'dd9c96ad-b57c-4440-b284-27c7f1351fd0',
          options: 'Opt1: 0, Opt2: 1, Opt3: 2',
          prompt: 'multi',
          rawScore: '',
          response: 'value: 0',
          reviewing_id: 'c482d1fd-5b0f-4cae-b10d-77cbb4151386',
          secret_user_id: '[admin account] (ml_test1_account@gmail.com)',
          user_id: '0e6d026f-b382-4022-9208-74a54768ea81',
          source_user_subject_id: 'bba7bcd3-f245-4354-9461-b494f186dcca',
          source_user_secret_id: 'source-secret-id',
          source_user_nickname: 'Mock source user',
          source_user_relation: 'admin',
          source_user_tag: 'Mock Tag',
          target_user_subject_id: '116d59c1-2bb5-405b-8503-cb6c1e6b7620',
          target_user_secret_id: 'target-secret-id',
          target_user_nickname: 'Mock target user',
          target_user_tag: 'Mock Tag',
          input_user_subject_id: '0a7544d8-bae2-4ed9-9e83-80401e537cd9',
          input_user_secret_id: 'input-secret-id',
          input_user_nickname: 'Mock input user',
          version: '2.1.0',
          event_id: '',
          timezone_offset: '',
        },
        {
          activity_flow_submission_id: '',
          activity_end_time: '1689764605250.957',
          activity_id: '39cc3d0f-8a82-462c-946f-61dcee6cbe1a',
          activity_name: 'New Activity#Single_Multi_Slider - Assessment',
          activity_flow_id: '',
          activity_flow_name: '',
          activity_scheduled_time: '1689764371123',
          activity_start_time: '1689764605250.957',
          flag: 'completed',
          id: '09b0cac4-303a-4ce9-94bd-dff922c24947',
          item: 'slider',
          item_id: 'ab47ab74-1ae5-475b-b1cb-bc868ead793f',
          options: '0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5',
          prompt: 'slider',
          rawScore: '',
          response: 'value: 5',
          reviewing_id: 'c482d1fd-5b0f-4cae-b10d-77cbb4151386',
          secret_user_id: '[admin account] (ml_test1_account@gmail.com)',
          user_id: '0e6d026f-b382-4022-9208-74a54768ea81',
          source_user_subject_id: 'bba7bcd3-f245-4354-9461-b494f186dcca',
          source_user_secret_id: 'source-secret-id',
          source_user_nickname: 'Mock source user',
          source_user_relation: 'admin',
          source_user_tag: 'Mock Tag',
          target_user_subject_id: '116d59c1-2bb5-405b-8503-cb6c1e6b7620',
          target_user_secret_id: 'target-secret-id',
          target_user_nickname: 'Mock target user',
          target_user_tag: 'Mock Tag',
          input_user_subject_id: '0a7544d8-bae2-4ed9-9e83-80401e537cd9',
          input_user_secret_id: 'input-secret-id',
          input_user_nickname: 'Mock input user',
          version: '2.1.0',
          event_id: '',
          timezone_offset: '',
        },
      ]);
    });
    test('should return an array with items and subscale calculation in first item', () => {
      const rawAnswersObject = getObjectFromList(
        mockedDecryptedAnswersWithSubscales,
        (item) => item.activityItem.name,
      );
      //eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const result = getReportData([], rawAnswersObject, mockedDecryptedAnswersWithSubscales);
      expect(result).toEqual([
        {
          'Final SubScale Score': 5,
          'Optional text for Final SubScale Score': 'Description #2 for range 4~20',
          activity_flow_submission_id: '',
          activity_end_time: '1698673935278',
          activity_id: 'eb521f27-5ccb-4286-97ce-704793294015',
          activity_name: 'New Activity#SimpleItems-3 (No skippable)',
          activity_flow_id: '',
          activity_flow_name: '',
          activity_scheduled_time: 'not scheduled',
          activity_start_time: '1698673918439',
          flag: 'completed',
          id: '8daa8ec9-7c54-4a51-a87f-f5a14b1294d3',
          item: 'single',
          item_id: 'e3d95ec0-32cd-4dff-8f81-6a0debfe7099',
          options: 'Opt1: 0 (score: 3), Opt2: 1 (score: 5), Opt3: 2 (score: 1)',
          prompt: 'single',
          rawScore: 9,
          response: 'value: 2',
          reviewing_id: '',
          secret_user_id: 'respondentSecretId',
          'ss-1': 5,
          'ss-2': 6,
          user_id: '835e5277-5949-4dff-817a-d85c17a3604f',
          source_user_subject_id: 'bba7bcd3-f245-4354-9461-b494f186dcca',
          source_user_secret_id: 'source-secret-id',
          source_user_nickname: 'Mock source user',
          source_user_relation: 'admin',
          source_user_tag: 'Mock Tag',
          target_user_subject_id: '116d59c1-2bb5-405b-8503-cb6c1e6b7620',
          target_user_secret_id: 'target-secret-id',
          target_user_nickname: 'Mock target user',
          target_user_tag: 'Mock Tag',
          input_user_subject_id: '0a7544d8-bae2-4ed9-9e83-80401e537cd9',
          input_user_secret_id: 'input-secret-id',
          input_user_nickname: 'Mock input user',
          version: '1.2.0',
          event_id: '',
          timezone_offset: '',
        },
        {
          activity_flow_submission_id: '',
          activity_end_time: '1698673935278',
          activity_id: 'eb521f27-5ccb-4286-97ce-704793294015',
          activity_name: 'New Activity#SimpleItems-3 (No skippable)',
          activity_flow_id: '',
          activity_flow_name: '',
          activity_scheduled_time: 'not scheduled',
          activity_start_time: '1698673918439',
          flag: 'completed',
          id: '8daa8ec9-7c54-4a51-a87f-f5a14b1294d3',
          item: 'multi',
          item_id: '16a50393-7952-4fcb-8e3b-5f042ab05ed9',
          options: 'Opt1: 0 (score: 1), Opt2: 1 (score: 3), Opt3: 2 (score: 0)',
          prompt: 'multi',
          rawScore: 4,
          response: 'value: 0',
          reviewing_id: '',
          secret_user_id: 'respondentSecretId',
          user_id: '835e5277-5949-4dff-817a-d85c17a3604f',
          source_user_subject_id: 'bba7bcd3-f245-4354-9461-b494f186dcca',
          source_user_secret_id: 'source-secret-id',
          source_user_nickname: 'Mock source user',
          source_user_relation: 'admin',
          source_user_tag: 'Mock Tag',
          target_user_subject_id: '116d59c1-2bb5-405b-8503-cb6c1e6b7620',
          target_user_secret_id: 'target-secret-id',
          target_user_nickname: 'Mock target user',
          target_user_tag: 'Mock Tag',
          input_user_subject_id: '0a7544d8-bae2-4ed9-9e83-80401e537cd9',
          input_user_secret_id: 'input-secret-id',
          input_user_nickname: 'Mock input user',
          version: '1.2.0',
          event_id: '',
          timezone_offset: '',
        },
        {
          activity_flow_submission_id: '',
          activity_end_time: '1698673935278',
          activity_id: 'eb521f27-5ccb-4286-97ce-704793294015',
          activity_name: 'New Activity#SimpleItems-3 (No skippable)',
          activity_flow_id: '',
          activity_flow_name: '',
          activity_scheduled_time: 'not scheduled',
          activity_start_time: '1698673918439',
          flag: 'completed',
          id: '8daa8ec9-7c54-4a51-a87f-f5a14b1294d3',
          item: 'slider',
          item_id: '42231d03-316b-42e3-8c9b-cd117c916e6d',
          options:
            '0: 0 (score: 1), 1: 1 (score: 2), 2: 2 (score: 3), 3: 3 (score: 4), 4: 4 (score: 5), 5: 5 (score: 6)',
          prompt: 'slider',
          rawScore: 21,
          response: 'value: 2',
          reviewing_id: '',
          secret_user_id: 'respondentSecretId',
          user_id: '835e5277-5949-4dff-817a-d85c17a3604f',
          source_user_subject_id: 'bba7bcd3-f245-4354-9461-b494f186dcca',
          source_user_secret_id: 'source-secret-id',
          source_user_nickname: 'Mock source user',
          source_user_relation: 'admin',
          source_user_tag: 'Mock Tag',
          target_user_subject_id: '116d59c1-2bb5-405b-8503-cb6c1e6b7620',
          target_user_secret_id: 'target-secret-id',
          target_user_nickname: 'Mock target user',
          target_user_tag: 'Mock Tag',
          input_user_subject_id: '0a7544d8-bae2-4ed9-9e83-80401e537cd9',
          input_user_secret_id: 'input-secret-id',
          input_user_nickname: 'Mock input user',
          version: '1.2.0',
          event_id: '',
          timezone_offset: '',
        },
        {
          activity_flow_submission_id: '',
          activity_end_time: '1698673935278',
          activity_id: 'eb521f27-5ccb-4286-97ce-704793294015',
          activity_name: 'New Activity#SimpleItems-3 (No skippable)',
          activity_flow_id: '',
          activity_flow_name: '',
          activity_scheduled_time: 'not scheduled',
          activity_start_time: '1698673918439',
          flag: 'completed',
          id: '8daa8ec9-7c54-4a51-a87f-f5a14b1294d3',
          item: 'gender_screen',
          item_id: 'ac8643f5-3c98-4ce7-b94c-8735a8bd2943',
          options: 'Male: 0, Female: 1',
          prompt: 'How do you describe yourself?',
          rawScore: '',
          response: 'value: 0',
          reviewing_id: '',
          secret_user_id: 'respondentSecretId',
          user_id: '835e5277-5949-4dff-817a-d85c17a3604f',
          source_user_subject_id: 'bba7bcd3-f245-4354-9461-b494f186dcca',
          source_user_secret_id: 'source-secret-id',
          source_user_nickname: 'Mock source user',
          source_user_relation: 'admin',
          source_user_tag: 'Mock Tag',
          target_user_subject_id: '116d59c1-2bb5-405b-8503-cb6c1e6b7620',
          target_user_secret_id: 'target-secret-id',
          target_user_nickname: 'Mock target user',
          target_user_tag: 'Mock Tag',
          input_user_subject_id: '0a7544d8-bae2-4ed9-9e83-80401e537cd9',
          input_user_secret_id: 'input-secret-id',
          input_user_nickname: 'Mock input user',
          version: '1.2.0',
          event_id: '',
          timezone_offset: '',
        },
        {
          activity_flow_submission_id: '',
          activity_end_time: '1698673935278',
          activity_id: 'eb521f27-5ccb-4286-97ce-704793294015',
          activity_name: 'New Activity#SimpleItems-3 (No skippable)',
          activity_flow_id: '',
          activity_flow_name: '',
          activity_scheduled_time: 'not scheduled',
          activity_start_time: '1698673918439',
          flag: 'completed',
          id: '8daa8ec9-7c54-4a51-a87f-f5a14b1294d3',
          item: 'age_screen',
          item_id: '028d9ee5-68cc-4c6f-9e13-60e7aa52a412',
          options: '',
          prompt: 'How old are you?',
          rawScore: '',
          response: '25',
          reviewing_id: '',
          secret_user_id: 'respondentSecretId',
          user_id: '835e5277-5949-4dff-817a-d85c17a3604f',
          source_user_subject_id: 'bba7bcd3-f245-4354-9461-b494f186dcca',
          source_user_secret_id: 'source-secret-id',
          source_user_nickname: 'Mock source user',
          source_user_relation: 'admin',
          source_user_tag: 'Mock Tag',
          target_user_subject_id: '116d59c1-2bb5-405b-8503-cb6c1e6b7620',
          target_user_secret_id: 'target-secret-id',
          target_user_nickname: 'Mock target user',
          target_user_tag: 'Mock Tag',
          input_user_subject_id: '0a7544d8-bae2-4ed9-9e83-80401e537cd9',
          input_user_secret_id: 'input-secret-id',
          input_user_nickname: 'Mock input user',
          version: '1.2.0',
          event_id: '',
          timezone_offset: '',
        },
      ]);
    });
  });
  describe('getMediaData', () => {
    const answersForRegularItems = mockedParsedAnswers[0].decryptedAnswers;
    const resultForDrawing = {
      fileName: 'target-secret-id-eabe2de0-9ea4-495b-a4d1-2966eece97f8-drawing.svg',
      url: 'https://media-dev.cmiml.net/mindlogger/2048412251058983019/023cf7e7-6083-443a-b74a-f32b75a711cd/e2e611df-02d5-4316-8406-c5d685b94090.svg',
    };
    const resultForPhoto = {
      fileName: 'target-secret-id-949f248c-1a4b-4a35-a5a2-898dfef72050-photo_text.jpg',
      url: 'https://media-dev.cmiml.net/mindlogger/2048412251058983019/d595acfc-8322-4d45-8ba5-c2f793b5476e/rn_image_picker_lib_temp_46ecc18c-2c7d-4d72-8d27-636c37e2e6f3.jpg',
    };
    const resultForVideo = {
      fileName: 'target-secret-id-949f248c-1a4b-4a35-a5a2-898dfef72050-video_text.mp4',
      url: 'https://media-dev.cmiml.net/mindlogger/2048412251058983019/4fc51edd-2dab-4048-836b-f1b9bf0270f6/rn_image_picker_lib_temp_9309b1eb-90b0-4908-a24d-be6fa06def10.mp4',
    };
    const resultForAudio = {
      fileName: 'target-secret-id-949f248c-1a4b-4a35-a5a2-898dfef72050-audio_text.m4a',
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
      const rawAnswersObject = getObjectFromList(
        decryptedAnswers,
        (item) => item.activityItem.name,
      );
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
          activity_id: '16d2c8e5-8541-4b7f-b598-6a310caee5f5',
          activity_name: 'New Activity#Drawing-item2',
          activity_flow_id: null,
          activity_flow_name: null,
          activity_scheduled_time: 'not scheduled',
          activity_start_time: '1689770351000',
          id: 'eabe2de0-9ea4-495b-a4d1-2966eece97f8',
          activity_flow_submission_id: '',
          item: 'drawing',
          item_id: 'e2e611df-02d5-4316-8406-c5d685b94090',
          options: '',
          press_back_time: '',
          press_popup_skip_time: '',
          press_popup_keep_time: '',
          press_done_time: '',
          press_next_time: '',
          press_skip_time: '',
          press_undo_time: '',
          prompt: 'drawing\n',
          response: 'target-secret-id-eabe2de0-9ea4-495b-a4d1-2966eece97f8-drawing.svg',
          response_option_selection_time: '1689770402756',
          secret_user_id: 'respondentSecretId',
          user_id: '835e5277-5949-4dff-817a-d85c17a3604f',
          source_user_subject_id: 'bba7bcd3-f245-4354-9461-b494f186dcca',
          source_user_secret_id: 'source-secret-id',
          source_user_nickname: 'Mock source user',
          source_user_relation: 'admin',
          source_user_tag: 'Mock Tag',
          target_user_subject_id: '116d59c1-2bb5-405b-8503-cb6c1e6b7620',
          target_user_secret_id: 'target-secret-id',
          target_user_nickname: 'Mock target user',
          target_user_tag: 'Mock Tag',
          input_user_subject_id: '0a7544d8-bae2-4ed9-9e83-80401e537cd9',
          input_user_secret_id: 'input-secret-id',
          input_user_nickname: 'Mock input user',
          version: '1.1.1',
          event_id: '',
          timezone_offset: '',
        },
        {
          activity_end_time: '1689770404000',
          activity_id: '16d2c8e5-8541-4b7f-b598-6a310caee5f5',
          activity_name: 'New Activity#Drawing-item2',
          activity_flow_id: null,
          activity_flow_name: null,
          activity_scheduled_time: 'not scheduled',
          activity_start_time: '1689770351000',
          id: 'eabe2de0-9ea4-495b-a4d1-2966eece97f8',
          activity_flow_submission_id: '',
          item: 'drawing',
          item_id: 'e2e611df-02d5-4316-8406-c5d685b94090',
          options: '',
          press_back_time: '',
          press_popup_skip_time: '',
          press_popup_keep_time: '',
          press_done_time: '1689770404752',
          press_next_time: '',
          press_skip_time: '',
          press_undo_time: '',
          prompt: 'drawing\n',
          response: '',
          response_option_selection_time: '',
          secret_user_id: 'respondentSecretId',
          user_id: '835e5277-5949-4dff-817a-d85c17a3604f',
          source_user_subject_id: 'bba7bcd3-f245-4354-9461-b494f186dcca',
          source_user_secret_id: 'source-secret-id',
          source_user_nickname: 'Mock source user',
          source_user_relation: 'admin',
          source_user_tag: 'Mock Tag',
          target_user_subject_id: '116d59c1-2bb5-405b-8503-cb6c1e6b7620',
          target_user_secret_id: 'target-secret-id',
          target_user_nickname: 'Mock target user',
          target_user_tag: 'Mock Tag',
          input_user_subject_id: '0a7544d8-bae2-4ed9-9e83-80401e537cd9',
          input_user_secret_id: 'input-secret-id',
          input_user_nickname: 'Mock input user',
          version: '1.1.1',
          event_id: '',
          timezone_offset: '',
        },
      ]);
    });
    test('should return an array for journey data with splash screen', () => {
      const decryptedAnswers = [mockedDecryptedObjectForDrawing];
      const rawAnswersObject = getObjectFromList(
        decryptedAnswers,
        (item) => item.activityItem.name,
      );
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
          activity_id: '16d2c8e5-8541-4b7f-b598-6a310caee5f5',
          activity_name: 'New Activity#Drawing-item2',
          activity_flow_id: null,
          activity_flow_name: null,
          activity_scheduled_time: 'not scheduled',
          activity_start_time: '1689770351000',
          id: 'eabe2de0-9ea4-495b-a4d1-2966eece97f8',
          activity_flow_submission_id: '',
          item: 'Splash Screen',
          item_id: '',
          options: '',
          press_back_time: '',
          press_popup_skip_time: '',
          press_popup_keep_time: '',
          press_done_time: '',
          press_next_time: '1689770402755',
          press_skip_time: '',
          press_undo_time: '',
          prompt: '',
          response: '',
          response_option_selection_time: '',
          secret_user_id: 'respondentSecretId',
          user_id: '835e5277-5949-4dff-817a-d85c17a3604f',
          source_user_subject_id: 'bba7bcd3-f245-4354-9461-b494f186dcca',
          source_user_secret_id: 'source-secret-id',
          source_user_nickname: 'Mock source user',
          source_user_relation: 'admin',
          source_user_tag: 'Mock Tag',
          target_user_subject_id: '116d59c1-2bb5-405b-8503-cb6c1e6b7620',
          target_user_secret_id: 'target-secret-id',
          target_user_nickname: 'Mock target user',
          target_user_tag: 'Mock Tag',
          input_user_subject_id: '0a7544d8-bae2-4ed9-9e83-80401e537cd9',
          input_user_secret_id: 'input-secret-id',
          input_user_nickname: 'Mock input user',
          version: '1.1.1',
          event_id: null,
          timezone_offset: '',
        },
        {
          activity_end_time: '1689770404000',
          activity_id: '16d2c8e5-8541-4b7f-b598-6a310caee5f5',
          activity_name: 'New Activity#Drawing-item2',
          activity_flow_id: null,
          activity_flow_name: null,
          activity_scheduled_time: 'not scheduled',
          activity_start_time: '1689770351000',
          id: 'eabe2de0-9ea4-495b-a4d1-2966eece97f8',
          activity_flow_submission_id: '',
          item: 'drawing',
          item_id: 'e2e611df-02d5-4316-8406-c5d685b94090',
          options: '',
          press_back_time: '',
          press_popup_skip_time: '',
          press_popup_keep_time: '',
          press_done_time: '',
          press_next_time: '',
          press_skip_time: '',
          press_undo_time: '',
          prompt: 'drawing\n',
          response: 'target-secret-id-eabe2de0-9ea4-495b-a4d1-2966eece97f8-drawing.svg',
          response_option_selection_time: '1689770402756',
          secret_user_id: 'respondentSecretId',
          user_id: '835e5277-5949-4dff-817a-d85c17a3604f',
          source_user_subject_id: 'bba7bcd3-f245-4354-9461-b494f186dcca',
          source_user_secret_id: 'source-secret-id',
          source_user_nickname: 'Mock source user',
          source_user_relation: 'admin',
          source_user_tag: 'Mock Tag',
          target_user_subject_id: '116d59c1-2bb5-405b-8503-cb6c1e6b7620',
          target_user_secret_id: 'target-secret-id',
          target_user_nickname: 'Mock target user',
          target_user_tag: 'Mock Tag',
          input_user_subject_id: '0a7544d8-bae2-4ed9-9e83-80401e537cd9',
          input_user_secret_id: 'input-secret-id',
          input_user_nickname: 'Mock input user',
          version: '1.1.1',
          event_id: '',
          timezone_offset: '',
        },
        {
          activity_end_time: '1689770404000',
          activity_id: '16d2c8e5-8541-4b7f-b598-6a310caee5f5',
          activity_name: 'New Activity#Drawing-item2',
          activity_flow_id: null,
          activity_flow_name: null,
          activity_scheduled_time: 'not scheduled',
          activity_start_time: '1689770351000',
          id: 'eabe2de0-9ea4-495b-a4d1-2966eece97f8',
          activity_flow_submission_id: '',
          item: 'drawing',
          item_id: 'e2e611df-02d5-4316-8406-c5d685b94090',
          options: '',
          press_back_time: '',
          press_popup_skip_time: '',
          press_popup_keep_time: '',
          press_done_time: '1689770404752',
          press_next_time: '',
          press_skip_time: '',
          press_undo_time: '',
          prompt: 'drawing\n',
          response: '',
          response_option_selection_time: '',
          secret_user_id: 'respondentSecretId',
          user_id: '835e5277-5949-4dff-817a-d85c17a3604f',
          source_user_subject_id: 'bba7bcd3-f245-4354-9461-b494f186dcca',
          source_user_secret_id: 'source-secret-id',
          source_user_nickname: 'Mock source user',
          source_user_relation: 'admin',
          source_user_tag: 'Mock Tag',
          target_user_subject_id: '116d59c1-2bb5-405b-8503-cb6c1e6b7620',
          target_user_secret_id: 'target-secret-id',
          target_user_nickname: 'Mock target user',
          target_user_tag: 'Mock Tag',
          input_user_subject_id: '0a7544d8-bae2-4ed9-9e83-80401e537cd9',
          input_user_secret_id: 'input-secret-id',
          input_user_nickname: 'Mock input user',
          version: '1.1.1',
          event_id: '',
          timezone_offset: '',
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
