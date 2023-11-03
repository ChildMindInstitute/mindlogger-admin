import { StabilityTrackerPhaseType } from 'shared/types';
import { mockedExportContextItemData, mockedSingleActivityItem } from 'shared/mock';

import { getFlankerCsvName } from './getReportName';
import {
  ZipFile,
  getABTrailsCsvName,
  getFileExtension,
  getMediaFileName,
  getReportZipName,
  getStabilityTrackerCsvName,
} from './getReportName';

const singleItem = {
  activityItem: mockedSingleActivityItem,
  answer: {
    value: 2,
    text: 'Extra info',
  },
  items: [],
  ...mockedExportContextItemData,
};

describe('getReportName', () => {
  describe('getReportZipName', () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2000-01-01'));
    });
    afterAll(() => {
      jest.useRealTimers();
    });
    test.each`
      name                | suffix          | expected                                            | description
      ${ZipFile.Drawing}  | ${''}           | ${'drawing-responses-Sat Jan 01 2000.zip'}          | ${'should return zip file name'}
      ${ZipFile.ABTrails} | ${'-response1'} | ${'trails-responses-Sat Jan 01 2000-response1.zip'} | ${'should return zip file name with suffix'}
    `('$description', ({ name, suffix, expected }) => {
      expect(getReportZipName(name, suffix)).toBe(expected);
    });
  });
  describe('getStabilityTrackerCsvName', () => {
    test.each`
      id                                        | phaseType                              | expected                                                      | description
      ${'5bc795cf-7eea-4042-9c48-f83435f66639'} | ${StabilityTrackerPhaseType.Challenge} | ${'5bc795cf-7eea-4042-9c48-f83435f66639_challenge-phase.csv'} | ${'should return csv file name'}
      ${'5bc795cf-7eea-4042-9c48-f83435f66639'} | ${''}                                  | ${'5bc795cf-7eea-4042-9c48-f83435f66639_.csv'}                | ${'should return csv file with empty phaseType'}
      ${''}                                     | ${StabilityTrackerPhaseType.Focus}     | ${'_focus-phase.csv'}                                         | ${'should return csv file with empty id'}
    `('$description', ({ id, phaseType, expected }) => {
      expect(getStabilityTrackerCsvName(id, phaseType)).toBe(expected);
    });
  });
  describe('getABTrailsCsvName', () => {
    test.each`
      index | id                                        | expected                                             | description
      ${0}  | ${'5bc795cf-7eea-4042-9c48-f83435f66639'} | ${'5bc795cf-7eea-4042-9c48-f83435f66639-trail1.csv'} | ${'should return csv file name'}
      ${1}  | ${''}                                     | ${'-trail2.csv'}                                     | ${'should return csv file with empty id'}
      ${2}  | ${undefined}                              | ${'-trail3.csv'}                                     | ${'should return csv file with id=undefined'}
    `('$description', ({ index, id, expected }) => {
      expect(getABTrailsCsvName(index, id)).toBe(expected);
    });
  });
  describe('getMediaFileName', () => {
    const expectedString =
      '949f248c-1a4b-4a35-a5a2-898dfef72050-835e5277-5949-4dff-817a-d85c17a3604f-single_text_score.mp4';
    const expectedStringWithoutExtension =
      '949f248c-1a4b-4a35-a5a2-898dfef72050-835e5277-5949-4dff-817a-d85c17a3604f-single_text_score.';
    test.each`
      item          | extension | expected                          | description
      ${singleItem} | ${'mp4'}  | ${expectedString}                 | ${'should return media file name'}
      ${singleItem} | ${''}     | ${expectedStringWithoutExtension} | ${'should return media file with empty extension'}
    `('$description', ({ item, extension, expected }) => {
      expect(getMediaFileName(item, extension)).toBe(expected);
    });
  });
  describe('getFileExtension', () => {
    const resourceWithoutExtension =
      'https://media-dev.cmiml.net/mindlogger/2048412251058983019/73ef3a61-8053-4558-814e-05baafbbdc11/f01c225c-62df-4867-b282-66f585a65112';
    const mp4FileName = `${resourceWithoutExtension}.m4a`;
    const quicktimeFileName = `${resourceWithoutExtension}.quicktime`;
    const mediaWithAttributesFileName = `${resourceWithoutExtension}.jpeg?image_size=1321231231232234`;

    test.each`
      fileUrl                        | expected  | description
      ${mp4FileName}                 | ${'m4a'}  | ${'should return an extension for regular url'}
      ${quicktimeFileName}           | ${'MOV'}  | ${'should return MOV for quicktime'}
      ${mediaWithAttributesFileName} | ${'jpeg'} | ${'should return an extension for url with attributes'}
      ${''}                          | ${''}     | ${'should return empty extension for empty url'}
    `('$description', ({ fileUrl, expected }) => {
      expect(getFileExtension(fileUrl)).toBe(expected);
    });
  });
  describe('getFlankerCsvName', () => {
    test.each`
      item          | expected                                                        | description
      ${singleItem} | ${'949f248c-1a4b-4a35-a5a2-898dfef72050-single_text_score.csv'} | ${'should return csv file name'}
    `('$description', ({ item, expected }) => {
      expect(getFlankerCsvName(item)).toBe(expected);
    });
  });
});
