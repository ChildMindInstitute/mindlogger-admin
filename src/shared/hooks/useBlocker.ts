import { useEffect } from 'react';
import type { Blocker, Transition } from 'history';

import history from 'routes/history';

export const useBlocker = (blocker: Blocker, when = true) => {
  useEffect(() => {
    if (!when) return;

    let popstateCount = 0;
    const onPopState = () => {
      popstateCount += 1;
      console.log(`[useBlocker] popstate fired (count: ${popstateCount})`);
    };
    window.addEventListener('popstate', onPopState);

    const unblock = history.block((tx: Transition) => {
      console.log(`[useBlocker] history.block callback fired — action: ${tx.action}`);
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    return () => {
      window.removeEventListener('popstate', onPopState);
      unblock();
    };
  }, [blocker, when]);
};
