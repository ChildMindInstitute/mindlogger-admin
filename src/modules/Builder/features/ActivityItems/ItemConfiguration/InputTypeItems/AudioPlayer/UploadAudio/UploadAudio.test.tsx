import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { UploadAudio } from './UploadAudio';
import { uploadAudioPopupDataTestid } from './UploadAudio.const';

const mockOnUpload = jest.fn();
const mockOnClose = jest.fn();
const mockOnChange = jest.fn();

describe('UploadAudio', () => {
  test('render popup when media is nullable and test button clicks', async () => {
    renderWithProviders(
      <UploadAudio
        open={true}
        media={null}
        onUpload={mockOnUpload}
        onClose={mockOnClose}
        onChange={mockOnChange}
      />,
    );

    expect(screen.getByTestId(uploadAudioPopupDataTestid)).toBeInTheDocument();
    expect(screen.getByTestId(`${uploadAudioPopupDataTestid}-title`)).toHaveTextContent(
      'Upload Audio',
    );
    expect(screen.getByTestId(`${uploadAudioPopupDataTestid}-description`)).toHaveTextContent(
      'Please upload file in one of the following formats: .mp3, .wav',
    );

    const closeButton = screen.getByTestId(`${uploadAudioPopupDataTestid}-close-button`);
    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();

    const inputElement = screen.getByTestId('media-uploader-input');
    expect(inputElement).toBeInTheDocument();

    const expectedAcceptValue = '.mp3,.wav';
    expect(inputElement).toHaveAttribute('accept', expectedAcceptValue);

    const expectedTypeValue = 'file';
    expect(inputElement).toHaveAttribute('type', expectedTypeValue);

    const cancelButton = screen.getByTestId(`${uploadAudioPopupDataTestid}-submit-button`);
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveTextContent('Cancel');
    await userEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith(null);
  });

  test('render popup when media is non-nullable and test button clicks', async () => {
    const media = {
      url: 'url',
      name: 'name',
      uploaded: true,
    };

    renderWithProviders(
      <UploadAudio
        open={true}
        media={media}
        onUpload={mockOnUpload}
        onClose={mockOnClose}
        onChange={mockOnChange}
      />,
    );

    const cancelButton = screen.getByTestId(`${uploadAudioPopupDataTestid}-secondary-button`);
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveTextContent('Cancel');
    await userEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();

    const uploadButton = screen.getByTestId(`${uploadAudioPopupDataTestid}-submit-button`);
    expect(uploadButton).toBeInTheDocument();
    expect(uploadButton).toHaveTextContent('Upload');
    await userEvent.click(uploadButton);
    expect(mockOnUpload).toHaveBeenCalled();
  });
});
