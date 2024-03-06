import { getReportMessage } from './SaveAndPublish.utils';

describe('SaveAndPublish.utils', () => {
  describe('getReportMessage', () => {
    test.each([
      ['text', true, { message: 'text' }],
      ['text', false, { message: undefined }],
    ])(
      'when message is "%m", showMessage is "%c" then returns the content %s',
      (message, showMessage, expected) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const result = getReportMessage({ message, showMessage });
        expect(result).toEqual(expected);
      },
    );
  });
});
