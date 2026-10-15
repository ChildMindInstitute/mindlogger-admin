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
});
