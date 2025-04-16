import { fireEvent, render, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { MediaType, UploadFileError } from 'shared/consts';

import { IncorrectFileBanner } from './IncorrectFileBanner';

const props = {
  errorType: UploadFileError.Size,
  fileType: MediaType.Image,
  onClose: vi.fn(),
};

describe('IncorrectFileBanner', () => {
  test('should render size error', () => {
    renderWithProviders(<IncorrectFileBanner {...props} />);

    expect(screen.getByTestId('error-banner')).toBeInTheDocument();
    expect(screen.getByText('Image is more than 25 MB.')).toBeInTheDocument();
  });

  describe('should render format error for', () => {
    test.each`
      fileType           | error                                  | description
      ${MediaType.Audio} | ${'Incorrect audio format.'}           | ${'audio'}
      ${MediaType.Image} | ${'Image format must be JPEG or PNG.'} | ${'image'}
      ${MediaType.Video} | ${'Incorrect video format.'}           | ${'video'}
    `('$description', ({ fileType, error }) => {
      renderWithProviders(
        <IncorrectFileBanner {...props} errorType={UploadFileError.Format} fileType={fileType} />,
      );

      expect(screen.getByText(error)).toBeInTheDocument();
    });
  });

  test('clicking the close button hides the banner', () => {
    render(<IncorrectFileBanner {...props} />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });
});
