import { ItemResponseType } from 'shared/consts';

import { getIsWebSupported, getIsMobileOnly, getIsWebOnly } from './responseType';

describe('getIsWebSupported', () => {
  test.each`
    responseType                                | expected | description
    ${ItemResponseType.ABTrails}                | ${false} | ${'Returns false for ABTrails'}
    ${ItemResponseType.Audio}                   | ${false} | ${'Returns false for Audio'}
    ${ItemResponseType.AudioPlayer}             | ${true}  | ${'Returns true for AudioPlayer'}
    ${ItemResponseType.Date}                    | ${true}  | ${'Returns true for Date'}
    ${ItemResponseType.Drawing}                 | ${false} | ${'Returns false for Drawing'}
    ${ItemResponseType.Flanker}                 | ${false} | ${'Returns false for Flanker'}
    ${ItemResponseType.Geolocation}             | ${false} | ${'Returns false for Geolocation'}
    ${ItemResponseType.Message}                 | ${true}  | ${'Returns true for Message'}
    ${ItemResponseType.MultipleSelection}       | ${true}  | ${'Returns true for MultipleSelection'}
    ${ItemResponseType.MultipleSelectionPerRow} | ${true}  | ${'Returns true for MultipleSelectionPerRow'}
    ${ItemResponseType.NumberSelection}         | ${true}  | ${'Returns true for NumberSelection'}
    ${ItemResponseType.ParagraphText}           | ${true}  | ${'Returns true for ParagraphText'}
    ${ItemResponseType.Photo}                   | ${false} | ${'Returns false for Photo'}
    ${ItemResponseType.PhrasalTemplate}         | ${true}  | ${'Returns true for PhrasalTemplate'}
    ${ItemResponseType.SingleSelection}         | ${true}  | ${'Returns true for SingleSelection'}
    ${ItemResponseType.SingleSelectionPerRow}   | ${true}  | ${'Returns true for SingleSelectionPerRow'}
    ${ItemResponseType.Slider}                  | ${true}  | ${'Returns true for Slider'}
    ${ItemResponseType.SliderRows}              | ${true}  | ${'Returns true for SliderRows'}
    ${ItemResponseType.StabilityTracker}        | ${false} | ${'Returns false for StabilityTracker'}
    ${ItemResponseType.Text}                    | ${true}  | ${'Returns true for Text'}
    ${ItemResponseType.Time}                    | ${true}  | ${'Returns true for Time'}
    ${ItemResponseType.TimeRange}               | ${true}  | ${'Returns true for TimeRange'}
    ${ItemResponseType.TouchPractice}           | ${false} | ${'Returns false for TouchPractice'}
    ${ItemResponseType.TouchTest}               | ${false} | ${'Returns false for TouchTest'}
    ${ItemResponseType.Unity}                   | ${false} | ${'Returns false for Unity'}
    ${ItemResponseType.Video}                   | ${false} | ${'Returns false for Video'}
    ${'test'}                                   | ${false} | ${'Returns false for other response types'}
    ${1}                                        | ${false} | ${'Returns false for other response types'}
    ${false}                                    | ${false} | ${'Returns false for other response types'}
  `('$description', ({ responseType, expected }) => {
    expect(getIsWebSupported([{ responseType }])).toEqual(expected);
  });

  describe('getIsMobileOnly', () => {
    test.each`
      responseType                                | expected | description
      ${ItemResponseType.ABTrails}                | ${true}  | ${'Returns true for ABTrails'}
      ${ItemResponseType.Audio}                   | ${true}  | ${'Returns true for Audio'}
      ${ItemResponseType.AudioPlayer}             | ${false} | ${'Returns false for AudioPlayer'}
      ${ItemResponseType.Date}                    | ${false} | ${'Returns false for Date'}
      ${ItemResponseType.Drawing}                 | ${true}  | ${'Returns true for Drawing'}
      ${ItemResponseType.Flanker}                 | ${true}  | ${'Returns true for Flanker'}
      ${ItemResponseType.Geolocation}             | ${true}  | ${'Returns true for Geolocation'}
      ${ItemResponseType.Message}                 | ${false} | ${'Returns false for Message'}
      ${ItemResponseType.MultipleSelection}       | ${false} | ${'Returns false for MultipleSelection'}
      ${ItemResponseType.MultipleSelectionPerRow} | ${false} | ${'Returns false for MultipleSelectionPerRow'}
      ${ItemResponseType.NumberSelection}         | ${false} | ${'Returns false for NumberSelection'}
      ${ItemResponseType.ParagraphText}           | ${false} | ${'Returns false for ParagraphText'}
      ${ItemResponseType.Photo}                   | ${true}  | ${'Returns true for Photo'}
      ${ItemResponseType.PhrasalTemplate}         | ${false} | ${'Returns false for PhrasalTemplate'}
      ${ItemResponseType.SingleSelection}         | ${false} | ${'Returns false for SingleSelection'}
      ${ItemResponseType.SingleSelectionPerRow}   | ${false} | ${'Returns false for SingleSelectionPerRow'}
      ${ItemResponseType.Slider}                  | ${false} | ${'Returns false for Slider'}
      ${ItemResponseType.SliderRows}              | ${false} | ${'Returns false for SliderRows'}
      ${ItemResponseType.StabilityTracker}        | ${true}  | ${'Returns true for StabilityTracker'}
      ${ItemResponseType.Text}                    | ${false} | ${'Returns false for Text'}
      ${ItemResponseType.Time}                    | ${false} | ${'Returns false for Time'}
      ${ItemResponseType.TimeRange}               | ${false} | ${'Returns false for TimeRange'}
      ${ItemResponseType.TouchPractice}           | ${false} | ${'Returns false for TouchPractice'}
      ${ItemResponseType.TouchTest}               | ${false} | ${'Returns false for TouchTest'}
      ${ItemResponseType.Unity}                   | ${false} | ${'Returns false for Unity'}
      ${ItemResponseType.Video}                   | ${true}  | ${'Returns true for Video'}
      ${'test'}                                   | ${false} | ${'Returns false for other response types'}
      ${1}                                        | ${false} | ${'Returns false for other response types'}
      ${false}                                    | ${false} | ${'Returns false for other response types'}
    `('$description', ({ responseType, expected }) => {
      expect(getIsMobileOnly(responseType)).toEqual(expected);
    });
  });

  describe('getIsWebOnly', () => {
    test.each`
      responseType                                | expected | description
      ${ItemResponseType.ABTrails}                | ${false} | ${'Returns false for ABTrails'}
      ${ItemResponseType.Audio}                   | ${false} | ${'Returns false for Audio'}
      ${ItemResponseType.AudioPlayer}             | ${false} | ${'Returns false for AudioPlayer'}
      ${ItemResponseType.Date}                    | ${false} | ${'Returns false for Date'}
      ${ItemResponseType.Drawing}                 | ${false} | ${'Returns false for Drawing'}
      ${ItemResponseType.Flanker}                 | ${false} | ${'Returns false for Flanker'}
      ${ItemResponseType.Geolocation}             | ${false} | ${'Returns false for Geolocation'}
      ${ItemResponseType.Message}                 | ${false} | ${'Returns false for Message'}
      ${ItemResponseType.MultipleSelection}       | ${false} | ${'Returns false for MultipleSelection'}
      ${ItemResponseType.MultipleSelectionPerRow} | ${false} | ${'Returns false for MultipleSelectionPerRow'}
      ${ItemResponseType.NumberSelection}         | ${false} | ${'Returns false for NumberSelection'}
      ${ItemResponseType.ParagraphText}           | ${false} | ${'Returns false for ParagraphText'}
      ${ItemResponseType.Photo}                   | ${false} | ${'Returns false for Photo'}
      ${ItemResponseType.PhrasalTemplate}         | ${true}  | ${'Returns true for PhrasalTemplate'}
      ${ItemResponseType.SingleSelection}         | ${false} | ${'Returns false for SingleSelection'}
      ${ItemResponseType.SingleSelectionPerRow}   | ${false} | ${'Returns false for SingleSelectionPerRow'}
      ${ItemResponseType.Slider}                  | ${false} | ${'Returns false for Slider'}
      ${ItemResponseType.SliderRows}              | ${false} | ${'Returns false for SliderRows'}
      ${ItemResponseType.StabilityTracker}        | ${false} | ${'Returns false for StabilityTracker'}
      ${ItemResponseType.Text}                    | ${false} | ${'Returns false for Text'}
      ${ItemResponseType.Time}                    | ${false} | ${'Returns false for Time'}
      ${ItemResponseType.TimeRange}               | ${false} | ${'Returns false for TimeRange'}
      ${ItemResponseType.TouchPractice}           | ${false} | ${'Returns false for TouchPractice'}
      ${ItemResponseType.TouchTest}               | ${false} | ${'Returns false for TouchTest'}
      ${ItemResponseType.Unity}                   | ${false} | ${'Returns false for Unity'}
      ${ItemResponseType.Video}                   | ${false} | ${'Returns false for Video'}
      ${'test'}                                   | ${false} | ${'Returns false for other response types'}
      ${1}                                        | ${false} | ${'Returns false for other response types'}
      ${false}                                    | ${false} | ${'Returns false for other response types'}
    `('$description', ({ responseType, expected }) => {
      expect(getIsWebOnly(responseType)).toEqual(expected);
    });
  });
});
