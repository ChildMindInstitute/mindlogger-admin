import { useEffect, useRef, useState } from 'react';

import {
  checkPassword,
  isAccountPasswordPolicySatisfied,
  type PasswordCheckResult,
} from 'shared/utils/passwordValidation';

function passwordRequirementsSectionTitleKey(
  displayCheck: PasswordCheckResult,
  displayPolicySatisfied: boolean,
): 'passwordMustIncludeMinimum' | 'passwordRequirementsMet' | 'passwordMustInclude' {
  if (displayPolicySatisfied) {
    return 'passwordRequirementsMet';
  }
  if (
    displayCheck.meetsCharTypeRequirement &&
    (!displayCheck.hasNoSpaces || !displayCheck.meetsLength)
  ) {
    return 'passwordMustIncludeMinimum';
  }
  return 'passwordMustInclude';
}

/**
 * Live `checkPassword` plus debounced UI flags: hide the 4-type grid and show “all met” only after
 * `debounceMs` with no `password` change (immediate reset when those conditions become false).
 * Title copy uses the same debounced snapshot so it stays in sync with grid visibility and “met”.
 */
export function usePasswordRequirementsChecklistDisplay(password: string, debounceMs: number) {
  const result = checkPassword(password);

  const [hideCharTypesGrid, setHideCharTypesGrid] = useState(() => result.meetsCharTypeRequirement);
  const [displayPolicySatisfied, setDisplayPolicySatisfied] = useState(() =>
    isAccountPasswordPolicySatisfied(result),
  );
  const [displayCheckResult, setDisplayCheckResult] = useState(() => result);
  const [isEmptyForDisplay, setIsEmptyForDisplay] = useState(() => password.length === 0);

  const passwordRef = useRef(password);
  // Ensure we're always using the latest password value in the debounced check
  passwordRef.current = password;

  useEffect(() => {
    const id = window.setTimeout(() => {
      const latest = checkPassword(passwordRef.current);

      setHideCharTypesGrid(latest.meetsCharTypeRequirement);
      setDisplayPolicySatisfied(isAccountPasswordPolicySatisfied(latest));
      setDisplayCheckResult(latest);
      setIsEmptyForDisplay(passwordRef.current.length === 0);
    }, debounceMs);

    return () => window.clearTimeout(id);
  }, [password, debounceMs]);

  return {
    result,
    hideCharTypesGrid,
    displayPolicySatisfied,
    passwordRequirementsSectionTitleKey: passwordRequirementsSectionTitleKey(
      displayCheckResult,
      displayPolicySatisfied,
    ),
    isEmptyForDisplay,
  };
}
