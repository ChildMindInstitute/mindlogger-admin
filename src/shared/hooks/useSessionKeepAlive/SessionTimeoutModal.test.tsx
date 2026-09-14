import { fireEvent, render, screen } from '@testing-library/react';

import { SessionTimeoutModal } from './SessionTimeoutModal';
import { MS_IN_MIN, MS_IN_SEC } from './useSessionKeepAlive.const';

const onStayLoggedIn = vi.fn();
const onLogOut = vi.fn();

const renderModal = (msRemaining = 5 * MS_IN_MIN) =>
  render(
    <SessionTimeoutModal
      msRemaining={msRemaining}
      onStayLoggedIn={onStayLoggedIn}
      onLogOut={onLogOut}
    />,
  );

const clickOn = (part: string) =>
  fireEvent.click(screen.getByTestId(`session-timeout-modal-${part}`));

describe('SessionTimeoutModal', () => {
  afterEach(() => vi.clearAllMocks());

  test('asks whether the user is still there', () => {
    renderModal();

    expect(screen.getByText('Are you still there?')).toBeInTheDocument();
  });

  test('spells out how long is left to answer', () => {
    renderModal(4 * MS_IN_MIN + 7 * MS_IN_SEC);

    expect(screen.getByText(/we'll log you out in 4:07\./)).toBeInTheDocument();
  });

  test('staying logged in answers the countdown', () => {
    renderModal();

    clickOn('submit-button');

    expect(onStayLoggedIn).toHaveBeenCalledTimes(1);
    expect(onLogOut).not.toHaveBeenCalled();
  });

  test('logging out ends the session instead', () => {
    renderModal();

    clickOn('secondary-button');

    expect(onLogOut).toHaveBeenCalledTimes(1);
    expect(onStayLoggedIn).not.toHaveBeenCalled();
  });

  // Dismissing without answering would leave the countdown running where nobody can see it.
  test.each(['close-button', 'backdrop'])('closing it via the %s keeps the session', (part) => {
    renderModal();

    clickOn(part);

    expect(onStayLoggedIn).toHaveBeenCalledTimes(1);
    expect(onLogOut).not.toHaveBeenCalled();
  });
});
