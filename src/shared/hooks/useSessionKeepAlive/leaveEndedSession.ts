import { SessionStorageKeys } from 'shared/utils/storage';
import { dbg } from 'shared/utils/sessionDebugLog';

// A tab that slept through a logout and someone else signing in holds a snapshot of a session that
// has ended. It cannot tear down, because the shared store it would clear belongs to whoever signed
// in after it. Nor can it stay: everything on screen is the old user's. So it drops what is its own
// and reloads, leaving a note for the boot on the way back in.
export const leaveEndedSession = () => {
  dbg('leaveEndedSession');
  // Per tab, and survives a reload, so the applet private keys would otherwise outlive the session
  // they belong to. Nothing here is shared, so clearing it takes nothing from the live session.
  sessionStorage.clear();

  // Set after the clear, and read on the way back in. Without it the reload would read the tokens
  // the browser now holds and walk straight into a session this tab was never signed in to.
  sessionStorage.setItem(SessionStorageKeys.SessionEnded, 'true');

  window.location.reload();
};
