import { Location, NavigateFunction } from 'react-router-dom';

import { SoftLockData } from 'modules/Auth/state/Auth.schema';
import { LocationStateKeys } from 'shared/types';

import { navigateToLibrary } from './navigateToLibrary';

type NavigateAfterLoginArgs = {
  email: string;
  softLockData?: SoftLockData;
  from?: Location;
};

// Back to the soft-locked page for the same user, else the page they came from, else the library
export const navigateAfterLogin = (
  navigate: NavigateFunction,
  { email, softLockData, from }: NavigateAfterLoginArgs,
) => {
  if (softLockData && email === softLockData.email) {
    navigate(softLockData.redirectTo, {
      state: { [LocationStateKeys.Workspace]: softLockData.workspace },
    });

    return;
  }

  if (from) {
    navigate(from);

    return;
  }

  navigateToLibrary(navigate);
};
