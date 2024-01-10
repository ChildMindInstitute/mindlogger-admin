import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { initReactI18next } from 'react-i18next';
import { AxiosResponse } from 'axios';

import i18n from 'i18n';
import { postFileUploadApi } from 'api';

import * as CropPopupUtils from '../CropPopup/CropPopup.utils';
import { Uploader, UploaderProps } from '.';

jest.mock('api');
i18n.use(initReactI18next).init({
  lng: 'en',
  resources: {},
});

const renderComponent = (props: UploaderProps) => render(<Uploader {...props} />);
const mockSetValue = jest.fn();
const mockGetValue = jest.fn();
const postFileUploadApiMock = postFileUploadApi as jest.MockedFunction<typeof postFileUploadApi>;
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
    global.URL.createObjectURL = jest.fn((file: Blob) => `mocked-url://${file.name}`);
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
    expect(await screen.getByTestId('image-uploader-crop-popup')).toBeInTheDocument();

    postFileUploadApiMock.mockResolvedValueOnce({
      data: { result: { url: 'https://example.com/test-image.png' } },
    } as AxiosResponse);

    const mockCropImage = jest.spyOn(CropPopupUtils, 'cropImage');
    mockCropImage.mockImplementation(({ onReady }) => {
      const mockedBlob = new Blob();
      onReady(mockedBlob);
    });

    await userEvent.click(screen.getByText(/save/i));

    expect(postFileUploadApi).toHaveBeenCalledWith(expect.any(FormData));
    expect(mockSetValue).toHaveBeenCalledWith('https://example.com/test-image.png');
  });

  test('handles image delete', async () => {
    const getImageValueMock = jest.fn().mockReturnValue('https://example.com/uploaded-image.jpg');
    renderComponent({ ...uploaderProps, getValue: getImageValueMock });

    const uploaderContainer = screen.getByTestId('image-uploader');
    fireEvent.mouseEnter(uploaderContainer);

    expect(await screen.findByTestId('action-buttons')).toBeInTheDocument();
    expect(await screen.findByTestId('action-buttons-edit')).toBeInTheDocument();
    expect(await screen.findByTestId('action-buttons-delete')).toBeInTheDocument();

    const deleteButton = screen.getByTestId('action-buttons-delete');
    await userEvent.click(deleteButton);

    expect(await screen.getByTestId('image-uploader-remove-popup')).toBeInTheDocument();

    const modalRemoveButton = screen.getByText('remove');
    await userEvent.click(modalRemoveButton);

    expect(await mockSetValue).toHaveBeenCalledWith('');
  });

  test('handles image format error', async () => {
    renderComponent(uploaderProps);
    const input = screen.getByTestId('upload-file');
    const mockImageIncorrectFormat = new File(['(⌐□_□)'], 'test-image.svg', { type: 'image/svg' });
    fireEvent.change(input, { target: { files: [mockImageIncorrectFormat] } });

    expect(screen.getByText(descriptionText)).toBeInTheDocument();
    expect(await screen.getByText('incorrectImageFormat')).toBeInTheDocument();
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
    expect(await screen.getByText(/Image is more than/i)).toBeInTheDocument();
  });
});
