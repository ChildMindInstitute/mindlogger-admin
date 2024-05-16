import { getLatestReportUrl } from './DownloadReport.utils';

describe('getLatestReportUrl', () => {
  test.each([
    ['...', `data:application/pdf;base64,...`],
    ['', 'data:application/pdf;base64,'],
  ])(
    'should return a valid data URL for a PDF with the given base64 string',
    (base64Str, expectedUrl) => {
      const result = getLatestReportUrl(base64Str);
      expect(result).toEqual(expectedUrl);
    },
  );
});
