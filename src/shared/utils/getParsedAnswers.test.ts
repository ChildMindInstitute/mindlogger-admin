import { vi, describe, test, expect, afterEach, beforeAll } from 'vitest';
import axios from 'axios';

import { remapFailedAnswers, getAnswersWithPublicUrls } from './getParsedAnswers';
import { mockSuccessfulHttpResponse } from './axios-mocks';

// Mock the api module
vi.mock('api');

describe('getParsedAnswers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  beforeAll(() => {
    vi.restoreAllMocks();
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
      // Setup the mock response for axios.post using the mockSuccessfulHttpResponse utility
      vi.mocked(axios.post).mockResolvedValue(
        mockSuccessfulHttpResponse({
          result: ['publicDrawingUrl', 'publicAudioUrl', 'publicVideoUrl', 'publicPhotoUrl'],
        }),
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

    test('should handle unity items with taskData URLs', async () => {
      vi.mocked(axios.post).mockResolvedValue(
        mockSuccessfulHttpResponse({
          result: ['publicAudioUrl', 'publicUnity1', 'publicUnity2', 'publicUnity3'],
        }),
      );

      const parsedAnswers = [
        {
          decryptedAnswers: [
            {
              appletId: 'appletId',
              activityItem: {
                name: 'audio',
                responseType: 'audio',
              },
              answer: {
                value: 'private_audio_url',
              },
            },
            {
              appletId: 'appletId',
              activityItem: {
                name: 'unity',
                responseType: 'unity',
              },
              answer: {
                value: {
                  taskData: ['private_unity1', 'private_unity2', 'private_unity3'],
                },
              },
            },
          ],
          decryptedEvents: [],
        },
      ];
      // @ts-ignore
      const result = await getAnswersWithPublicUrls(parsedAnswers);

      expect(result[0].decryptedAnswers[0].answer.value).toBe('publicAudioUrl');
      expect(result[0].decryptedAnswers[1].answer.value).toEqual({
        taskData: ['publicUnity1', 'publicUnity2', 'publicUnity3'],
      });
    });

    test('should maintain URL index sync with mixed unity and media items', async () => {
      vi.mocked(axios.post).mockResolvedValue(
        mockSuccessfulHttpResponse({
          result: ['publicUnity1', 'publicUnity2', 'publicAudio', 'publicPhoto'],
        }),
      );

      const parsedAnswers = [
        {
          decryptedAnswers: [
            {
              appletId: 'appletId',
              activityItem: {
                name: 'unity',
                responseType: 'unity',
              },
              answer: {
                value: {
                  taskData: ['priv1', 'priv2'],
                },
              },
            },
            {
              appletId: 'appletId',
              activityItem: {
                name: 'audio',
                responseType: 'audio',
              },
              answer: {
                value: 'priv_audio',
              },
            },
            {
              appletId: 'appletId',
              activityItem: {
                name: 'photo',
                responseType: 'photo',
              },
              answer: {
                value: 'priv_photo',
              },
            },
          ],
          decryptedEvents: [],
        },
      ];
      // @ts-ignore
      const result = await getAnswersWithPublicUrls(parsedAnswers);

      // Unity consumes indices 0,1
      expect(result[0].decryptedAnswers[0].answer.value).toEqual({
        taskData: ['publicUnity1', 'publicUnity2'],
      });
      // Audio gets index 2
      expect(result[0].decryptedAnswers[1].answer.value).toBe('publicAudio');
      // Photo gets index 3
      expect(result[0].decryptedAnswers[2].answer.value).toBe('publicPhoto');
    });
  });
});
