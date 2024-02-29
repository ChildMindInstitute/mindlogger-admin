import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import { expectBanner, renderWithProviders } from 'shared/utils';

import { EditRespondentPopup } from '.';

const onCloseMock = jest.fn();
const successFakeRequest = () => new Promise((res) => res(null));

const chosenAppletData = {
  appletId: '12312',
  respondentSecretId: '12312',
  respondentId: '12312',
  respondentNickname: 'respondentNickname',
  ownerId: '1',
  subjectId: 'subj-1',
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
    jest.spyOn(mockedAxios, 'put').mockImplementation(successFakeRequest);

    const { store } = renderWithProviders(<EditRespondentPopup {...commonProps} />);

    const nicknameInput = screen
      .getByTestId('dashboard-respondents-edit-popup-nickname')
      .querySelector('input') as HTMLInputElement;
    await userEvent.clear(nicknameInput);
    await userEvent.type(nicknameInput, 'john');

    const submitButton = screen.getByTestId('dashboard-respondents-edit-popup-submit-button');
    await userEvent.click(submitButton);
    await waitFor(() => expectBanner(store, 'SaveSuccessBanner'));
  });
});
