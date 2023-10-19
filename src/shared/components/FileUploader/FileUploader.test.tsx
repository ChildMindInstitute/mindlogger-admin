import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Box } from '@mui/material';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { FileUploader } from './FileUploader';
import { FileUploaderProps } from './FileUploader.types';

const mockOnFileReady = jest.fn();
const mockOnDownloadTemplate = jest.fn();
const mockOnDownloadSecond = jest.fn();
export const mockInvalidFileFormatError = <Box>Invalid file format.</Box>;
const fileUploaderProps = {
  onFileReady: mockOnFileReady,
  uploadLabel: 'Upload File',
  invalidFileFormatError: mockInvalidFileFormatError,
};

i18n.use(initReactI18next).init({
  lng: 'en',
  resources: {},
});

const renderComponent = (props: FileUploaderProps) => render(<FileUploader {...props} />);

describe('FileUploader', () => {
  beforeEach(() => {
    // Clear mock function calls before each test
    jest.clearAllMocks();
  });

  test('renders with default values', () => {
    renderComponent(fileUploaderProps);

    expect(screen.getByText('Upload File')).toBeInTheDocument();
  });

  // test('handles file upload successfully', async () => {
  //   const file = new File(['file contents'], 'test.csv', { type: 'text/csv' });
  //
  //   renderComponent(fileUploaderProps);
  //
  //   const input = screen.getByTestId('upload-file');
  //
  //   fireEvent.change(input, { target: { files: [file] } });
  //
  //   // Add assertions based on your component's behavior
  //   // For example, you might check if the file name is displayed after successful upload
  //   expect(mockOnFileReady).toHaveBeenCalledWith(expect.objectContaining({ name: 'test.csv' }));
  //   expect(screen.getByText('test.csv')).toBeInTheDocument();
  // });

  // test('displays error message on invalid file format', async () => {
  //   const invalidFile = new File(['file contents'], 'test.txt', { type: 'text/plain' });
  //
  //   renderComponent(fileUploaderProps);
  //
  //   const input = screen.getByTestId('upload-file');
  //
  //   fireEvent.change(input, { target: { files: [invalidFile] } });
  //
  //   // Add assertions based on your component's behavior
  //   // For example, you might check if the error message is displayed
  //   expect(mockOnFileReady).not.toHaveBeenCalled();
  //   expect(screen.getByText('Invalid file format.')).toBeInTheDocument();
  // });

  // Add more tests based on your component's features and behaviors
  // For example, testing drag and drop functionality, error handling, etc.
});
