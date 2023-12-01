import { remapFailedAnswers } from './getParsedAnswers';

describe('getParsedAnswers', () => {
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
});
