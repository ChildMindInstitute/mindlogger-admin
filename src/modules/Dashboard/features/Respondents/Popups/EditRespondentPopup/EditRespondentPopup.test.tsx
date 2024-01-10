import { waitFor, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { EditRespondentPopup } from '.';

const onCloseMock = jest.fn();
const successFakeRequest = () => new Promise((res) => res(null));

const chosenAppletData = {
  appletId: '12312',
  respondentSecretId: '12312',
  respondentId: '12312',
  respondentNickname: 'respondentNickname',
  ownerId: '1',
};

const commonProps = {
  onClose: onCloseMock,
  popupVisible: true,
  chosenAppletData,
};

describe('EditRespondentPopup component tests', () => {
  const mockedAxios = axios.create();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('EditRespondentPopup should appear with respondentSecretId and respondentNickname', async () => {
    renderWithProviders(<EditRespondentPopup {...commonProps} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue(chosenAppletData.respondentSecretId)).toBeInTheDocument();
      expect(screen.getByDisplayValue(chosenAppletData.respondentNickname)).toBeInTheDocument();
    });
  });

  test('EditRespondentPopup should appear success text', async () => {
    jest.spyOn(mockedAxios, 'post').mockImplementation(successFakeRequest);

    renderWithProviders(<EditRespondentPopup {...commonProps} />);

    fireEvent.change(screen.getByLabelText(/Nickname/i), { target: { value: '00000' } });
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() =>
      expect(
        screen.getByText('Nickname and ID have been updated successfully.'),
      ).toBeInTheDocument(),
    );
  });
});
