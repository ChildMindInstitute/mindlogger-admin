import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { initReactI18next } from 'react-i18next';

import i18n from 'i18n';

import { FileUploader } from './FileUploader';
import { FileUploaderProps } from './FileUploader.types';

const mockOnFileReady = vi.fn();
const mockOnDownloadTemplate = vi.fn();
export const mockInvalidFileFormatError = <span>Invalid file format.</span>;
const fileUploaderProps = {
  onFileReady: mockOnFileReady,
  uploadLabel: 'Upload File',
  invalidFileFormatError: mockInvalidFileFormatError,
  onDownloadTemplate: mockOnDownloadTemplate,
};

i18n.use(initReactI18next).init({
  lng: 'en',
  resources: {},
});

const renderComponent = (props: FileUploaderProps) => render(<FileUploader {...props} />);

describe('FileUploader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders with default values', () => {
    renderComponent(fileUploaderProps);

    expect(screen.getByText('Upload File')).toBeInTheDocument();
  });

  test('handles file upload successfully', async () => {
    const contentArray = ['header1,header2', 'value1,value2', 'value3,value4'];
    const file = new File([contentArray.join('\n')], 'test.csv', {
      type: 'text/csv',
    });
    await renderComponent(fileUploaderProps);
    const input = screen.getByTestId('upload-file-input');
    await userEvent.upload(input, file);

    expect(await screen.findByText('test.csv')).toBeInTheDocument();
    expect(mockOnFileReady).toHaveBeenCalledWith(expect.objectContaining({ name: 'test.csv' }));
  });

  test('returns parsing error if file does not content data', async () => {
    const invalidFile = new File(['File contents'], 'test.csv', {
      type: 'text/csv',
    });
    await renderComponent(fileUploaderProps);
    const input = screen.getByTestId('upload-file-input');
    await userEvent.upload(input, invalidFile);

    expect(mockOnFileReady).not.toHaveBeenCalled();
    expect(await screen.findByText('Invalid file format.')).toBeInTheDocument();
  });

  test('not uploads invalid file format', async () => {
    const invalidFile = new File(['file contents'], 'test.txt', { type: 'text/plain' });
    await renderComponent(fileUploaderProps);
    const input = screen.getByTestId('upload-file-input');
    await userEvent.upload(input, invalidFile);

    expect(mockOnFileReady).not.toHaveBeenCalled();
  });

  test('calls download template function', async () => {
    await renderComponent(fileUploaderProps);
    const downloadTemplateButton = screen.getByTestId('download-template');
    await userEvent.click(downloadTemplateButton);

    expect(mockOnDownloadTemplate).toHaveBeenCalled();
  });
});
