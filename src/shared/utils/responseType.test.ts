import { ItemResponseType } from 'shared/consts';

import { getIsWebSupported } from './responseType';

describe('getIsWebSupported', () => {
  test.each`
    responseType                                | expected | description
    ${ItemResponseType.Text}                    | ${true}  | ${'Should return true for Text response type'}
    ${ItemResponseType.SingleSelection}         | ${true}  | ${'Should return true for SingleSelection response type'}
    ${ItemResponseType.MultipleSelection}       | ${true}  | ${'Should return true for MultipleSelection response type'}
    ${ItemResponseType.Slider}                  | ${true}  | ${'Should return true for Slider response type'}
    ${ItemResponseType.NumberSelection}         | ${true}  | ${'Should return true for NumberSelection response type'}
    ${ItemResponseType.Message}                 | ${true}  | ${'Should return true for Message response type'}
    ${ItemResponseType.Date}                    | ${true}  | ${'Should return true for Date response type'}
    ${ItemResponseType.Time}                    | ${true}  | ${'Should return true for Time response type'}
    ${ItemResponseType.TimeRange}               | ${true}  | ${'Should return true for TimeRange response type'}
    ${ItemResponseType.AudioPlayer}             | ${true}  | ${'Should return true for AudioPlayer response type'}
    ${ItemResponseType.MultipleSelectionPerRow} | ${true}  | ${'Should return true for MultipleSelectionPerRow response type'}
    ${ItemResponseType.SingleSelectionPerRow}   | ${true}  | ${'Should return true for SingleSelectionPerRow response type'}
    ${ItemResponseType.SliderRows}              | ${true}  | ${'Should return true for SliderRows response type'}
    ${'test'}                                   | ${false} | ${'Should return true for other response types'}
    ${1}                                        | ${false} | ${'Should return true for other response types'}
    ${false}                                    | ${false} | ${'Should return true for other response types'}
  `('$description', ({ responseType, expected }) => {
    expect(getIsWebSupported([{ responseType }])).toEqual(expected);
  });
});
