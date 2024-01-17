import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';
import * as routerDom from 'react-router-dom';

import { renderWithProviders } from 'shared/utils';
import { mockedAppletId } from 'shared/mock';

import { SendInvitationPopup } from './SendInvitationPopup';
import { dataTestId } from './SendInvitationPopup.const';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
const mockedSecretUserId = '123';
const mockedRespondentId = '456';
const mockedEmail = 'test@test.com';

describe('SendInvitationPopup', () => {
  // test('renders the component with no email, submit after correct email enter', async () => {
  //   jest.spyOn(routerDom, 'useParams').mockReturnValue({ appletId: mockedAppletId });
  //   const { getByTestId, getByText, getByLabelText } = renderWithProviders(
  //     <SendInvitationPopup
  //       popupVisible
  //       onClose={() => {}}
  //       secretUserId={mockedSecretUserId}
  //       respondentId={mockedRespondentId}
  //       email={null}
  //     />,
  //   );
  //
  //   expect(getByTestId(dataTestId)).toBeInTheDocument();
  //   expect(getByText(`Add an email for ID: ${mockedSecretUserId}`)).toBeInTheDocument();
  //
  //   const submitBtn = getByText('Send Invitation');
  //   await userEvent.click(submitBtn);
  //
  //   expect(mockAxios.post).not.toHaveBeenCalled();
  //
  //   const emailInput = getByLabelText(/Email address/i);
  //   await userEvent.type(emailInput, mockedEmail);
  //   await userEvent.click(submitBtn);
  //
  //   await waitFor(() => {
  //     expect(mockAxios.post).toHaveBeenNthCalledWith(
  //       1,
  //       `/invitations/${mockedAppletId}/subject`,
  //       { email: mockedEmail, subjectId: mockedRespondentId },
  //       { signal: undefined },
  //     );
  //   });
  // });
  //
  // test('renders and submit the component with email', async () => {
  //   jest.spyOn(routerDom, 'useParams').mockReturnValue({ appletId: mockedAppletId });
  //   const { getByTestId, getByText } = renderWithProviders(
  //     <SendInvitationPopup
  //       popupVisible
  //       onClose={() => {}}
  //       secretUserId={mockedSecretUserId}
  //       respondentId={mockedRespondentId}
  //       email={mockedEmail}
  //     />,
  //   );
  //
  //   expect(getByTestId(dataTestId)).toBeInTheDocument();
  //   expect(getByText(`Confirm email for ID: ${mockedSecretUserId}`)).toBeInTheDocument();
  //
  //   await userEvent.click(getByText('Send Invitation'));
  //
  //   await waitFor(() => {
  //     expect(mockAxios.post).toHaveBeenNthCalledWith(
  //       1,
  //       `/invitations/${mockedAppletId}/subject`,
  //       { email: mockedEmail, subjectId: mockedRespondentId },
  //       { signal: undefined },
  //     );
  //   });
  // });
});
