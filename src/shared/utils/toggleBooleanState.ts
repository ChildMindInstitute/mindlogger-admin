import { Dispatch, SetStateAction } from 'react';

export const toggleBooleanState = (setIsOpen: Dispatch<SetStateAction<boolean>>) => () =>
  setIsOpen((prevState) => !prevState);
