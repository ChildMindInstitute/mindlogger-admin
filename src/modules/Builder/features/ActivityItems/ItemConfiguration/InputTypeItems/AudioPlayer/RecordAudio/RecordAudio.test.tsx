// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils';
import * as useMediaUploadHooks from 'shared/hooks/useMediaUpload/useMediaUpload';

import { RecordAudio } from './RecordAudio';
import * as audioRecorderHooks from './RecordAudio.hooks';
import { recordAudioDataTestid } from './RecordAudio.const';

const mockClearBlob = jest.fn();
const mockOnUpload = jest.fn();
const mockOnChange = jest.fn();
const mockOnClose = jest.fn();

jest.mock('modules/Builder/components/MLPlayer', () => ({
  ...jest.requireActual('modules/Builder/components/MLPlayer'),
  MLPlayer: ({ onRemove, 'data-testid': dataTestid }) => (
    <div data-testid={dataTestid}>
      <button data-testid={`${dataTestid}-remove`} onClick={onRemove}></button>
    </div>
  ),
}));

describe('RecordAudio', () => {
  let originalCreateObjectURL;

  beforeEach(() => {
    originalCreateObjectURL = window.URL.createObjectURL;
    window.URL.createObjectURL = () => 'https://test.com/mock-record';
  });

  afterEach(() => {
    window.URL.createObjectURL = originalCreateObjectURL;
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('render RecordAudio component, test remove record', async () => {
    const useAudioRecorderSpy = jest.spyOn(audioRecorderHooks, 'useAudioRecorder');
    const useMediaUploadSpy = jest.spyOn(useMediaUploadHooks, 'useMediaUpload');

    useAudioRecorderSpy.mockImplementation(({ setFile }) => ({
      startRecording: jest.fn(),
      stopRecording: () => {
        // workaround for event listener
        setTimeout(() => {
          setFile({});
        });
      },
      togglePauseResume: jest.fn(),
      clearBlob: mockClearBlob,
      isRecording: false,
      isPaused: false,
      isStopped: false,
      recordingTime: 0,
    }));
    useMediaUploadSpy.mockImplementation(({ callback }) => ({
        executeMediaUpload: () => {
          callback?.('mock-url');
        },
        isLoading: false,
        error: {
          data: 'Mock Error',
        },
        stopUpload: jest.fn,
      }));

    renderWithProviders(
      <RecordAudio open onUpload={mockOnUpload} onChange={mockOnChange} onClose={mockOnClose} />,
    );

    const recordButton = screen.getByTestId(`${recordAudioDataTestid}-record`);
    await userEvent.click(recordButton);

    const stopButton = screen.getByTestId(`${recordAudioDataTestid}-stop`);
    await userEvent.click(stopButton);

    useAudioRecorderSpy.mockImplementation(() => ({
      startRecording: jest.fn(),
      stopRecording: jest.fn(),
      togglePauseResume: jest.fn(),
      clearBlob: mockClearBlob,
      isRecording: false,
      isPaused: false,
      isStopped: true,
      recordingTime: 200,
    }));

    const player = await screen.findByTestId(`${recordAudioDataTestid}-player`);
    expect(player).toBeInTheDocument();

    screen.debug();
    const error = screen.getByTestId(`${recordAudioDataTestid}-error`);
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent('Mock Error');

    const removeRecord = screen.getByTestId(`${recordAudioDataTestid}-player-remove`);
    expect(removeRecord).toBeInTheDocument();
    await userEvent.click(removeRecord);
    expect(mockClearBlob).toBeCalled();
  });

  test('render RecordAudio component, test upload record', async () => {
    const useAudioRecorderSpy = jest.spyOn(audioRecorderHooks, 'useAudioRecorder');
    const useMediaUploadSpy = jest.spyOn(useMediaUploadHooks, 'useMediaUpload');
    useAudioRecorderSpy.mockImplementation(({ setFile }) => ({
      startRecording: jest.fn(),
      stopRecording: () => {
        setTimeout(() => {
          setFile({});
        });
      },
      togglePauseResume: jest.fn(),
      clearBlob: mockClearBlob,
      isRecording: false,
      isPaused: false,
      isStopped: false,
      recordingTime: 0,
    }));
    useMediaUploadSpy.mockImplementation(({ callback }) => ({
        executeMediaUpload: () => {
          callback?.('mock-url');
        },
        isLoading: false,
        error: null,
        stopUpload: jest.fn,
      }));

    renderWithProviders(
      <RecordAudio open onUpload={mockOnUpload} onChange={mockOnChange} onClose={mockOnClose} />,
    );

    const recordButton = screen.getByTestId(`${recordAudioDataTestid}-record`);
    await userEvent.click(recordButton);

    const stopButton = screen.getByTestId(`${recordAudioDataTestid}-stop`);
    await userEvent.click(stopButton);

    useAudioRecorderSpy.mockImplementation(() => ({
      startRecording: jest.fn(),
      stopRecording: jest.fn(),
      togglePauseResume: jest.fn(),
      clearBlob: mockClearBlob,
      isRecording: false,
      isPaused: false,
      isStopped: true,
      recordingTime: 200,
    }));

    const player = await screen.findByTestId(`${recordAudioDataTestid}-player`);
    expect(player).toBeInTheDocument();

    const cancelButton = screen.getByTestId(`${recordAudioDataTestid}-secondary-button`);
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveTextContent('Cancel');
    await userEvent.click(cancelButton);
    expect(mockOnClose).toBeCalled();

    const uploadButton = screen.getByTestId(`${recordAudioDataTestid}-submit-button`);
    expect(uploadButton).toBeInTheDocument();
    expect(uploadButton).toHaveTextContent('Upload');
    await userEvent.click(uploadButton);

    expect(mockOnUpload).toBeCalledWith('mock-url');
    expect(mockOnChange).toBeCalledWith({ uploaded: true, url: 'mock-url' });
  });
});
