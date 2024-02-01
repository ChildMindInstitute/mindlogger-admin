// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { fireEvent, screen } from '@testing-library/react';

import { ItemResponseType } from 'shared/consts';

import { mockedTestid, renderItemConfigurationByType } from '../__mocks__';

describe('Item Configuration: Photo/Video/Audio/Geo', () => {
  test.each`
    responseType                    | testId                           | header              | content                                                     | description
    ${ItemResponseType.Photo}       | ${`${mockedTestid}-photo`}       | ${'Photo Response'} | ${'The respondent will be able to take or upload a photo.'} | ${'Photo is rendered correctly'}
    ${ItemResponseType.Video}       | ${`${mockedTestid}-video`}       | ${'Video Response'} | ${'The respondent will be able to take or upload a video.'} | ${'Video is rendered correctly'}
    ${ItemResponseType.Audio}       | ${`${mockedTestid}-audio`}       | ${'Audio'}          | ${'The respondent will be able to record audio.'}           | ${'Audio is rendered correctly'}
    ${ItemResponseType.Geolocation} | ${`${mockedTestid}-geolocation`} | ${'Geolocation'}    | ${'The respondent will be able to share geolocation.'}      | ${'Geolocation is rendered correctly'}
  `('$description', ({ responseType, testId, header, content }) => {
    renderItemConfigurationByType(responseType);

    const isAudio = responseType === ItemResponseType.Audio;

    expect(screen.getByTestId(testId)).toBeVisible();

    const title = screen.getByTestId(`${testId}-title`);
    const description = screen.getByTestId(`${testId}-description`);

    expect(title).toBeVisible();
    expect(title).toHaveTextContent(header);

    expect(description).toBeVisible();
    expect(description).toHaveTextContent(content);

    if (isAudio) {
      const maxDuration = screen.getByTestId(`${mockedTestid}-audio-record-max-duration`);

      expect(maxDuration).toBeVisible();
      expect(maxDuration.querySelector('label')).toHaveTextContent(
        'Max Recording Duration (seconds)',
      );
      expect(maxDuration.querySelector('input')).toHaveValue(300);
    }
  });

  test('Audio: Validation', async () => {
    renderItemConfigurationByType(ItemResponseType.Audio);

    fireEvent.change(
      screen.getByTestId(`${mockedTestid}-audio-record-max-duration`).querySelector('input'),
      { target: { value: -1 } },
    );

    expect(await screen.findByText('A positive integer is required')).toBeVisible();
  });
});
