// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { fireEvent, screen } from '@testing-library/react';

import { ItemResponseType } from 'shared/consts';

import { mockedItemName, mockedTestid, renderItemConfigurationByType } from '../__mocks__';

const mockedAudioTestid = `${mockedTestid}-audio-player`;

const renderAudioPlayer = (itemProps) =>
  renderItemConfigurationByType(ItemResponseType.AudioPlayer);

const selectAudioType = (isUpload) => {
  fireEvent.click(screen.getByTestId(`${mockedAudioTestid}-add`));

  fireEvent.click(screen.getByTestId(`${mockedAudioTestid}-${isUpload ? 'upload' : 'record'}`));
};

describe('ItemConfiguration: AudioPlayer', () => {
  test('Is rendered correctly', () => {
    renderAudioPlayer();

    expect(screen.getByTestId(mockedAudioTestid)).toBeVisible();

    const title = screen.getByTestId(`${mockedAudioTestid}-title`);
    const description = screen.getByTestId(`${mockedAudioTestid}-description`);

    expect(title).toBeVisible();
    expect(title).toHaveTextContent('Audio Player');
    expect(description).toBeVisible();
    expect(description).toHaveTextContent('The respondent will listen to an audio stimulus.');

    expect(screen.getByTestId(`${mockedAudioTestid}-add`)).toBeVisible();
  });

  test('Audio Options', () => {
    renderAudioPlayer();

    fireEvent.click(screen.getByTestId(`${mockedAudioTestid}-add`));

    const options = screen.getAllByTestId(new RegExp(`${mockedAudioTestid}-(upload|record)$`));
    expect(options).toHaveLength(2);

    const [upload, record] = options;

    expect(upload).toHaveTextContent('Upload Audio');
    expect(record).toHaveTextContent('Record Audio');
  });

  test('Upload Audio', async () => {
    renderAudioPlayer();

    selectAudioType(true);

    const mockedUploadTestid = `${mockedTestid}-upload-audio-popup`;

    expect(screen.getByTestId(mockedUploadTestid)).toBeVisible();
    expect(screen.getByTestId(`${mockedUploadTestid}-title`)).toHaveTextContent('Upload Audio');
    expect(screen.getByTestId(`${mockedUploadTestid}-description`)).toHaveTextContent(
      'Please upload file in one of the following formats: .mp3, .wav.',
    );
    expect(screen.getByTestId(`${mockedUploadTestid}-uploader`)).toBeVisible();
  });

  test('Record Audio', () => {
    renderAudioPlayer();

    selectAudioType(false);

    const mockedRecordTestid = `${mockedTestid}-record-audio-popup`;

    expect(screen.getByTestId(mockedRecordTestid)).toBeVisible();
    expect(screen.getByTestId(`${mockedRecordTestid}-title`)).toHaveTextContent('Record Audio');
    expect(screen.getByTestId(`${mockedRecordTestid}-description`)).toHaveTextContent(
      'Record audio using your device microphone.',
    );
    expect(screen.getByTestId(`${mockedRecordTestid}-record`)).toBeVisible();

    const stopButton = screen.getByTestId(`${mockedRecordTestid}-stop`);
    expect(stopButton).toBeVisible();
    expect(stopButton).toBeDisabled();
  });

  test('Remove Audio Popup', async () => {
    const ref = renderAudioPlayer();

    ref.current.setValue(`${mockedItemName}.responseValues.file`, 'https://bucket/test.mp3');

    const remove = await screen.findByTestId(`${mockedAudioTestid}-player-remove`);
    fireEvent.click(remove);

    expect(screen.getByTestId(`${mockedAudioTestid}-remove-popup`)).toBeVisible();
    expect(screen.getByTestId(`${mockedAudioTestid}-remove-popup-title`)).toHaveTextContent(
      'Delete Audio',
    );
    expect(screen.getByTestId(`${mockedAudioTestid}-remove-popup-description`)).toHaveTextContent(
      'Are you sure you want to delete the current audio?',
    );

    fireEvent.click(screen.getByTestId(`${mockedAudioTestid}-remove-popup-submit-button`));

    expect(screen.queryByTestId(`${mockedAudioTestid}-player`)).not.toBeInTheDocument();
    expect(ref.current.getValues(`${mockedItemName}.responseValues.file`)).toBeUndefined();
  });
});
