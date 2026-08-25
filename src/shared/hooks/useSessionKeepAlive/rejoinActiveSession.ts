// A tab that slept through a logout and someone else signing in holds a snapshot of a session that
// has ended. It cannot tear down, because the shared store it would clear belongs to whoever signed
// in after it. Dropping what is its own and reloading is the only way to reach the live session:
// tokens are read from a snapshot taken at load, so nothing short of a reload can refresh it.
export const rejoinActiveSession = () => {
  // Per tab, and survives a reload, so the applet private keys would otherwise outlive the session
  // they belong to. Nothing here is shared, so clearing it takes nothing from the live session.
  sessionStorage.clear();

  // No loop to guard against: the reload reads the tokens the browser actually holds, so the tab
  // comes back owning the session it just failed to match.
  window.location.reload();
};
