import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import * as CropPopupUtils from '../CropPopup/CropPopup.utils';

import { Uploader, UploaderProps } from '.';

jest.mock('api');

const mockImageUrl = 'https://example.com/test-image.png';

jest.mock('shared/hooks/useMediaUpload/useMediaUpload', () => ({
  useMediaUpload: ({ callback }: { callback: (url: string) => void }) => ({
    executeMediaUpload: jest.fn().mockImplementation(() => {
      callback(mockImageUrl);
    }),
    isLoading: false,
  }),
}));

const renderComponent = (props: UploaderProps) => renderWithProviders(<Uploader {...props} />);
const mockSetValue = jest.fn();
const mockGetValue = jest.fn();
const mockImageFile = new File(['(⌐□_□)'], 'test-image.png', { type: 'image/png' });
const descriptionText = 'Upload an Image';
const uploaderProps = {
  width: 20,
  height: 20,
  setValue: mockSetValue,
  getValue: mockGetValue,
  description: descriptionText,
  'data-testid': 'image-uploader',
};

describe('Uploader component', () => {
  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => 'mocked-url://mocked-url');
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without errors', () => {
    renderComponent(uploaderProps);

    expect(screen.getByText(descriptionText)).toBeInTheDocument();
  });

  test('handles image selection and upload', async () => {
    renderComponent(uploaderProps);
    const input = screen.getByTestId('upload-file');
    fireEvent.change(input, { target: { files: [mockImageFile] } });

    expect(await screen.findByText('test-image.png')).toBeInTheDocument();
    expect(screen.getByTestId('image-uploader-crop-popup')).toBeInTheDocument();

    const mockCropImage = jest.spyOn(CropPopupUtils, 'cropImage');
    mockCropImage.mockImplementation(({ onReady }) => {
      const mockedBlob = new Blob();
      onReady(mockedBlob);
    });

    await userEvent.click(screen.getByText(/save/i));

    expect(mockSetValue).toHaveBeenCalledWith(mockImageUrl);
  });

  test('handles image delete', async () => {
    const getImageValueMock = jest.fn().mockReturnValue(mockImageUrl);
    renderComponent({ ...uploaderProps, getValue: getImageValueMock });

    const uploaderContainer = screen.getByTestId('image-uploader');
    fireEvent.mouseEnter(uploaderContainer);

    expect(await screen.findByTestId('action-buttons')).toBeInTheDocument();
    expect(await screen.findByTestId('action-buttons-edit')).toBeInTheDocument();
    expect(await screen.findByTestId('action-buttons-delete')).toBeInTheDocument();

    const deleteButton = screen.getByTestId('action-buttons-delete');
    await userEvent.click(deleteButton);

    expect(await screen.getByTestId('image-uploader-remove-popup')).toBeInTheDocument();

    const modalRemoveButton = screen.getByText('Remove');
    await userEvent.click(modalRemoveButton);

    expect(await mockSetValue).toHaveBeenCalledWith('');
    expect(await screen.findByText('Image has been removed successfully.')).toBeInTheDocument();
  });

  test('handles image format error', async () => {
    renderComponent(uploaderProps);
    const input = screen.getByTestId('upload-file');
    const mockImageIncorrectFormat = new File(['(⌐□_□)'], 'test-image.svg', { type: 'image/svg' });
    fireEvent.change(input, { target: { files: [mockImageIncorrectFormat] } });

    expect(screen.getByText(descriptionText)).toBeInTheDocument();
    expect(await screen.findByText('Image format must be JPEG or PNG.')).toBeInTheDocument();
  });

  test('handles image size error', async () => {
    renderComponent(uploaderProps);
    const input = screen.getByTestId('upload-file');
    const generateLargeBlob = (sizeInMB: number) => {
      const bytesPerMB = 1024 * 1024;
      const sizeInBytes = sizeInMB * bytesPerMB;

      const buffer = new ArrayBuffer(sizeInBytes);
      const view = new DataView(buffer);

      for (let i = 0; i < sizeInBytes; i += Uint32Array.BYTES_PER_ELEMENT) {
        view.setUint32(i, 0, true);
      }

      return new Blob([buffer], { type: 'image/png' });
    };
    const mockImageIncorrectSize = new File([generateLargeBlob(30)], 'test-image.png', {
      type: 'image/png',
    });
    fireEvent.change(input, { target: { files: [mockImageIncorrectSize] } });

    expect(screen.getByText(descriptionText)).toBeInTheDocument();
    expect(await screen.findByText(/Image is more than/i)).toBeInTheDocument();
  });
});
