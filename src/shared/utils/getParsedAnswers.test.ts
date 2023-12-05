import axios from 'axios';

import { remapFailedAnswers, getAnswersWithPublicUrls } from './getParsedAnswers';

jest.mock('api');

describe('getParsedAnswers', () => {
  const mockedAxios = axios.create();

  afterEach(() => {
    jest.restoreAllMocks();
  });
  beforeAll(() => {
    jest.restoreAllMocks();
  });

  describe('remapFailedAnswers', () => {
    test('should return filtered out answers', () => {
      const parsedAnswers = [
        {
          decryptedAnswers: [
            {
              appletId: 'appletId',
              activityItem: {
                name: 'activityItemName',
              },
              answer: {
                type: '',
                screen: '',
                time: '',
              },
            },
            {
              appletId: 'appletId',
              activityItem: {
                name: 'activityItemName',
              },
              answer: {
                value: 'text',
              },
            },
          ],
          decryptedEvents: [
            {
              type: 'success',
              screen: 'screen',
              time: 'time',
            },
            {
              type: '',
              screen: '',
              time: '',
            },
          ],
        },
      ];
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      const result = remapFailedAnswers(parsedAnswers);
      expect(result).toEqual([
        {
          decryptedAnswers: [
            {
              appletId: 'appletId',
              activityItem: {
                name: 'activityItemName',
              },
              answer: null,
            },
            {
              appletId: 'appletId',
              activityItem: {
                name: 'activityItemName',
              },
              answer: {
                value: 'text',
              },
            },
          ],
          decryptedEvents: [
            {
              type: 'success',
              screen: 'screen',
              time: 'time',
            },
          ],
        },
      ]);
    });
  });

  describe('getAnswersWithPublicUrls', () => {
    test('should return answers with public urls', async () => {
      jest.spyOn(mockedAxios, 'post').mockImplementation(
        () =>
          new Promise((res) =>
            res({
              data: {
                result: ['publicDrawingUrl', 'publicAudioUrl', 'publicVideoUrl', 'publicPhotoUrl'],
              },
            }),
          ),
      );

      const parsedAnswers = [
        {
          decryptedAnswers: [
            {
              appletId: 'appletId',
              activityItem: {
                name: 'activityItemName',
                responseType: 'drawing',
              },
              answer: {
                value: {
                  uri: 'privateUrl',
                },
              },
            },
            {
              appletId: 'appletId',
              activityItem: {
                name: 'activityItemName',
                responseType: 'audio',
              },
              answer: {
                value: 'private_url',
              },
            },
            {
              appletId: 'appletId',
              activityItem: {
                name: 'activityItemName',
                responseType: 'video',
              },
              answer: {
                value: 'private_url',
              },
            },
            {
              appletId: 'appletId',
              activityItem: {
                name: 'activityItemName',
                responseType: 'photo',
              },
              answer: {
                value: 'private_url',
              },
            },
            {
              appletId: 'appletId',
              activityItem: {
                name: 'activityItemName',
              },
              answer: {
                value: 'text',
              },
            },
          ],
          decryptedEvents: [],
        },
      ];
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      const result = await getAnswersWithPublicUrls(parsedAnswers);
      expect(result).toEqual([
        {
          decryptedAnswers: [
            {
              appletId: 'appletId',
              activityItem: {
                name: 'activityItemName',
                responseType: 'drawing',
              },
              answer: {
                value: {
                  uri: 'publicDrawingUrl',
                },
              },
            },
            {
              appletId: 'appletId',
              activityItem: {
                name: 'activityItemName',
                responseType: 'audio',
              },
              answer: {
                value: 'publicAudioUrl',
              },
            },
            {
              appletId: 'appletId',
              activityItem: {
                name: 'activityItemName',
                responseType: 'video',
              },
              answer: {
                value: 'publicVideoUrl',
              },
            },
            {
              appletId: 'appletId',
              activityItem: {
                name: 'activityItemName',
                responseType: 'photo',
              },
              answer: {
                value: 'publicPhotoUrl',
              },
            },
            {
              appletId: 'appletId',
              activityItem: {
                name: 'activityItemName',
              },
              answer: {
                value: 'text',
              },
            },
          ],
          decryptedEvents: [],
        },
      ]);
    });
  });
});
