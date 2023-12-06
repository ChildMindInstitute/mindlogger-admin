import { DecryptedAnswerData } from 'shared/types';
import { mockedParsedAnswers } from 'shared/mock';

import { getDecryptedAnswersObject, getReportData } from './getReportAndMediaData';
import { ItemResponseType } from '../../consts';

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
    const decryptedAnswers = [
      textItem,
      textNullAnswerItem,
      textUndefinedAnswerItem,
    ] as DecryptedAnswerData[];
    const rawAnswersObject = {
      'itemName-1': textItem,
      'itemName-2': textNullAnswerItem,
      'itemName-3': textUndefinedAnswerItem,
    };

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
      const rawAnswersObject = {
        single: decryptedAnswers[0],
        multi: decryptedAnswers[1],
        slider: decryptedAnswers[2],
      };
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
  });
});
