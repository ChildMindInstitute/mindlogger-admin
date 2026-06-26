import { useEffect } from 'react';
import type { Blocker, Transition } from 'history';

import history from 'routes/history';

export const useBlocker = (blocker: Blocker, when = true) => {
  useEffect(() => {
    console.log(`[useBlocker] effect ran — when: ${when}, registering blocker`);

    if (!when) return;

    let popstateCount = 0;
    const onPopState = () => {
      popstateCount += 1;
      const state = window.history.state as { idx?: number; key?: string } | null;
      console.log(
        `[useBlocker] popstate fired (count: ${popstateCount}) — url: ${window.location.pathname}, history.state.idx: ${state?.idx ?? 'none'}`,
      );
    };
    window.addEventListener('popstate', onPopState);

    const unblock = history.block((tx: Transition) => {
      console.log(
        `[useBlocker] history.block callback — action: ${tx.action}, to: ${tx.location.pathname}, history.state.idx: ${(window.history.state as { idx?: number } | null)?.idx ?? 'none'}`,
      );
      const autoUnblockingTx = {
        ...tx,
        retry() {
          console.log(`[useBlocker] retry() called for action: ${tx.action}`);
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    return () => {
      console.log('[useBlocker] cleanup — unregistering blocker');
      window.removeEventListener('popstate', onPopState);
      unblock();
    };
  }, [blocker, when]);
};
