import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';
import { MediaType, UploadFileError } from 'shared/consts';

import { IncorrectFilePopup } from './IncorrectFilePopup';

const onCloseMock = jest.fn();

const dataTestid = 'incorrect-file-popup';

describe('IncorrectFilePopup', () => {
  test('should render size error popup and submit', () => {
    renderWithProviders(
      <IncorrectFilePopup
        popupVisible={true}
        onClose={onCloseMock}
        uiType={UploadFileError.Size}
        fileType={MediaType.Image}
        data-testid={dataTestid}
      />,
    );

    expect(screen.getByTestId(dataTestid)).toBeVisible();
    expect(screen.getByTestId(`${dataTestid}-text`)).toHaveTextContent('Image is more than 25 MB.');

    fireEvent.click(screen.getByText('Ok'));

    expect(onCloseMock).toBeCalled();
  });

  describe('should render format error popup for', () => {
    test.each`
      fileType           | error                                  | description
      ${MediaType.Audio} | ${'Incorrect audio format.'}           | ${'audio'}
      ${MediaType.Image} | ${'Image format must be JPEG or PNG.'} | ${'image'}
      ${MediaType.Video} | ${'Incorrect video format.'}           | ${'video'}
    `('$description', ({ fileType, error }) => {
      renderWithProviders(
        <IncorrectFilePopup
          popupVisible={true}
          onClose={onCloseMock}
          uiType={UploadFileError.Format}
          fileType={fileType}
          data-testid={dataTestid}
        />,
      );

      expect(screen.getByTestId(`${dataTestid}-text`)).toHaveTextContent(error);
    });
  });
});
