import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import * as routerDom from 'react-router-dom';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedAppletId, mockedFullSubjectId1 } from 'shared/mock';

import { SendInvitationPopup } from './SendInvitationPopup';
import { dataTestId } from './SendInvitationPopup.const';

vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useParams: () => vi.fn(),
  };
});
const mockedSecretUserId = '123';
const mockedRespondentId = '456';
const mockedEmail = 'test@test.com';
const mockedChosenAppletData = {
  appletId: mockedAppletId,
  createdAt: '2025-01-01T00:00:00',
  respondentSecretId: mockedSecretUserId,
  respondentId: mockedRespondentId,
  respondentNickname: 'respondentNickname',
  ownerId: '1',
  subjectId: mockedFullSubjectId1,
};
const commonPopupProps = {
  popupVisible: true,
  onClose: vi.fn(),
  chosenAppletData: mockedChosenAppletData,
  setChosenAppletData: vi.fn(),
};

describe('SendInvitationPopup', () => {
  test('renders the component with no email, submit after correct email enter', async () => {
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ appletId: mockedAppletId });
    const { getByTestId, getByText, getByLabelText } = renderWithProviders(
      <SendInvitationPopup {...commonPopupProps} email={null} />,
    );

    expect(getByTestId(dataTestId)).toBeInTheDocument();
    expect(getByText(`Add an email for ID: ${mockedSecretUserId}`)).toBeInTheDocument();

    const submitBtn = getByText('Send Invitation');
    await userEvent.click(submitBtn);

    expect(axios.post).not.toHaveBeenCalled();

    const emailInput = getByLabelText(/Email address/i);
    await userEvent.type(emailInput, mockedEmail);
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(axios.post).toHaveBeenNthCalledWith(
        1,
        `/invitations/${mockedAppletId}/subject`,
        { email: mockedEmail, subjectId: mockedFullSubjectId1 },
        { signal: expect.anything() },
      );
    });
  });

  test('renders and submit the component with email', async () => {
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ appletId: mockedAppletId });
    const { getByTestId, getByText } = renderWithProviders(
      <SendInvitationPopup {...commonPopupProps} email={mockedEmail} />,
    );

    expect(getByTestId(dataTestId)).toBeInTheDocument();
    expect(getByText(`Confirm email for ID: ${mockedSecretUserId}`)).toBeInTheDocument();

    await userEvent.click(getByText('Send Invitation'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenNthCalledWith(
        1,
        `/invitations/${mockedAppletId}/subject`,
        { email: mockedEmail, subjectId: mockedFullSubjectId1 },
        { signal: expect.anything() },
      );
    });
  });
});
