import { fireEvent } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';
import { RespondentStatus } from 'modules/Dashboard/types';

import { StatusFlag } from './StatusFlag';
import { dataTestId } from './StatusFlag.const';

describe('StatusFlag Component', () => {
  // test('renders without crashing with "Not Invited" status', () => {
  //   const { container, getByText } = renderWithProviders(
  //     <StatusFlag status={RespondentStatus.NotInvited} />,
  //   );
  //
  //   expect(container).toBeTruthy();
  //   expect(getByText('Not invited')).toBeInTheDocument();
  // });
  //
  // test('renders "Pending" status correctly', () => {
  //   const { getByText } = renderWithProviders(<StatusFlag status={RespondentStatus.Pending} />);
  //
  //   expect(getByText('Pending')).toBeInTheDocument();
  // });
  //
  // test('opens popover on button click when status is "Not Invited"', () => {
  //   const { getByTestId } = renderWithProviders(
  //     <StatusFlag status={RespondentStatus.NotInvited} />,
  //   );
  //   const button = getByTestId(`${dataTestId}-button`);
  //   fireEvent.click(button);
  //   const popover = getByTestId(`${dataTestId}-popover`);
  //
  //   expect(popover).toBeInTheDocument();
  // });
  //
  // test('does not open popover on button click when status is "Pending"', () => {
  //   const { getByTestId, queryByTestId } = renderWithProviders(
  //     <StatusFlag status={RespondentStatus.Pending} />,
  //   );
  //   const button = getByTestId(`${dataTestId}-button`);
  //   fireEvent.click(button);
  //   const popover = queryByTestId(`${dataTestId}-popover`);
  //
  //   expect(popover).toBeNull();
  // });
  //
  // test('calls onInviteClick when "invite them now" link is clicked', () => {
  //   const mockOnInviteClick = jest.fn();
  //   const { getByText, getByTestId } = renderWithProviders(
  //     <StatusFlag status={RespondentStatus.NotInvited} onInviteClick={mockOnInviteClick} />,
  //   );
  //   const button = getByTestId(`${dataTestId}-button`);
  //   fireEvent.click(button);
  //   const inviteLink = getByText('invite them now');
  //   fireEvent.click(inviteLink);
  //
  //   expect(mockOnInviteClick).toHaveBeenCalledTimes(1);
  // });
});
