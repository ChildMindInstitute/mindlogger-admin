// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useCustomFormContext } from 'modules/Builder/hooks';
import { renderWithProviders } from 'shared/utils';

import { AudioPlayerContent } from './AudioPlayerContent';
import { audioPlayerDataTestid } from './AudioPlayerContent.const';
import { uploadAudioPopupDataTestid } from '../UploadAudio/UploadAudio.const';

const mockFile = {
  size: 1000,
  type: 'audio/mp3',
  name: 'mock-file.mp3',
};
const mockMedia = {
  url: 'media-url',
  name: 'media-name',
  uploaded: true,
};
const mockSetMedia = jest.fn();
const mockSetValue = jest.fn();
const mockWatch = jest.fn();
const mockGetFieldState = jest.fn();

jest.mock('modules/Builder/hooks', () => ({
  ...jest.requireActual('modules/Builder/hooks'),
  useCustomFormContext: jest.fn(),
}));

jest.mock('modules/Builder/components/MLPlayer', () => ({
  ...jest.requireActual('modules/Builder/components/MLPlayer'),
  MLPlayer: () => <div data-testid="ml-player"></div>,
}));

describe('AudioPlayerContent component', () => {
  test('render AudioPlayerContent component when url is non-nullable', () => {
    useCustomFormContext.mockReturnValue({
      setValue: mockSetValue,
      watch: mockWatch,
      getFieldState: mockGetFieldState,
    });
    mockWatch.mockReturnValueOnce('mock-url');
    mockGetFieldState.mockReturnValueOnce({
      error: null,
    });

    renderWithProviders(
      <AudioPlayerContent media={mockMedia} setMedia={mockSetMedia} name={'name'} />,
    );

    const description = screen.getByTestId(`${audioPlayerDataTestid}-description`);
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent('The respondent will listen to an audio stimulus.');
    expect(screen.getByTestId('ml-player')).toBeInTheDocument();
  });

  test('render AudioPlayerContent component when url is nullable, test upload', async () => {
    useCustomFormContext.mockReturnValue({
      setValue: mockSetValue,
      watch: mockWatch,
      getFieldState: mockGetFieldState,
    });
    mockWatch.mockReturnValueOnce(null);
    mockGetFieldState.mockReturnValue({
      error: null,
    });

    renderWithProviders(
      <AudioPlayerContent media={mockMedia} setMedia={mockSetMedia} name={'name'} />,
    );

    const addButton = screen.getByTestId(`${audioPlayerDataTestid}-add`);
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveTextContent('Add Audio');

    await userEvent.click(addButton);

    const menuItemUpload = screen.getByTestId(`${audioPlayerDataTestid}-upload`);
    expect(menuItemUpload).toBeInTheDocument();

    await userEvent.click(menuItemUpload);

    expect(screen.getByTestId(uploadAudioPopupDataTestid)).toBeInTheDocument();

    const input = screen.getByTestId('media-uploader-input');
    await userEvent.upload(input, mockFile);

    const uploadButton = screen.getByTestId(`${uploadAudioPopupDataTestid}-submit-button`);
    expect(uploadButton).toBeInTheDocument();
    await userEvent.click(uploadButton);

    expect(mockSetValue).toBeCalledWith('name.responseValues.file', 'media-url');
  });

  test('render AudioPlayerContent component when url is nullable and test error', async () => {
    useCustomFormContext.mockReturnValue({
      setValue: mockSetValue,
      watch: mockWatch,
      getFieldState: mockGetFieldState,
    });
    mockWatch.mockReturnValueOnce(null);
    mockGetFieldState.mockReturnValue({
      error: {
        message: 'Mock error',
      },
    });

    renderWithProviders(
      <AudioPlayerContent media={mockMedia} setMedia={mockSetMedia} name={'name'} />,
    );

    expect(screen.getByTestId(`${audioPlayerDataTestid}-error`)).toHaveTextContent('Mock error');
  });
});
