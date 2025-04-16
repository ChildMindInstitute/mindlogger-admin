import { fireEvent, render, screen } from '@testing-library/react';

import { MediaUploader } from './MediaUploader';
import { MediaUploaderProps } from './MediaUploader.types';

const dataTestid = 'media-uploader';
const onUploadMock = vi.fn();

const fileUploaderProps = {
  width: 300,
  height: 300,
  media: null,
  hasPreview: false,
  onUpload: onUploadMock,
  'data-testid': dataTestid,
};

const file = {
  size: 1000,
  type: 'audio/mp3',
  name: 'my-file.mp3',
};

const renderComponent = (props: MediaUploaderProps) => render(<MediaUploader {...props} />);

describe('MediaUploader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render component', () => {
    renderComponent(fileUploaderProps);

    expect(screen.getByTestId(dataTestid)).toBeInTheDocument();
  });

  test('should upload file', () => {
    renderComponent({ ...fileUploaderProps });
    const input = screen.getByTestId('media-uploader-input');
    fireEvent.change(input, { target: { files: [file] } });

    expect(onUploadMock).toHaveBeenCalledWith(expect.objectContaining({ name: 'my-file.mp3' }));
  });

  test('should not upload file with invalid format', () => {
    const invalidFile = new File(['file contents'], 'test.txt', { type: 'text/plain' });
    renderComponent(fileUploaderProps);

    const input = screen.getByTestId('media-uploader-input');
    fireEvent.change(input, { target: { files: [invalidFile] } });

    expect(onUploadMock).not.toHaveBeenCalled();
    expect(screen.getByText('Audio file has wrong format')).toBeInTheDocument();
  });

  test('should not upload file bigger than 150 MB', () => {
    renderComponent(fileUploaderProps);

    const input = screen.getByTestId('media-uploader-input');
    fireEvent.change(input, { target: { files: [{ ...file, size: 157_286_403 }] } });

    expect(onUploadMock).not.toHaveBeenCalled();
    expect(screen.getByText('Audio is more than 150 MB')).toBeInTheDocument();
  });

  test('should show preview', () => {
    const media = { url: '_blank', name: 'my-file.mp3' };
    renderComponent({ ...fileUploaderProps, hasPreview: true, media });

    const input = screen.getByTestId('media-uploader-input');
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText('my-file.mp3')).toBeInTheDocument();
  });

  test('should show placeholder', () => {
    const placeholder = 'test placeholder';
    renderComponent({ ...fileUploaderProps, placeholder });

    expect(screen.getByText(placeholder)).toBeInTheDocument();
  });
});
