import { useEffect } from 'react';
import type { Blocker, Transition } from 'history';

import history from 'routes/history';

export const useBlocker = (blocker: Blocker, when = true) => {
  useEffect(() => {
    if (!when) return;

    const unblock = history.block((tx: Transition) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [blocker, when]);
};
