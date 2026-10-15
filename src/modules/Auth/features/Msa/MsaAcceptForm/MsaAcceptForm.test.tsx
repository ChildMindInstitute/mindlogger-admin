import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { MsaAcceptForm } from './MsaAcceptForm';

describe('MsaAcceptForm', () => {
  it('enables accepting only once the agreement is checked', async () => {
    const onAccept = vi.fn();
    renderWithProviders(
      <MsaAcceptForm secondaryButtonText="Log out" onSecondaryClick={vi.fn()} onAccept={onAccept}>
        <p>Body</p>
      </MsaAcceptForm>,
    );

    const acceptButton = screen.getByRole('button', { name: 'Accept and continue' });
    expect(acceptButton).toBeDisabled();

    await userEvent.click(
      screen.getByLabelText('I have read and agree to the Master Services Agreement.'),
    );
    await userEvent.click(acceptButton);

    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it('shows the error and offers to try again', () => {
    renderWithProviders(
      <MsaAcceptForm
        secondaryButtonText="Log out"
        onSecondaryClick={vi.fn()}
        onAccept={vi.fn()}
        error="We couldn't save your acceptance"
      >
        <p>Body</p>
      </MsaAcceptForm>,
    );

    expect(screen.getByText("We couldn't save your acceptance")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});
