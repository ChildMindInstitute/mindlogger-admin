import { KeyboardEvent } from 'react';

export const handleSearchKeyDown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') {
    event.stopPropagation();
  }
  if (event.key === 'Enter') {
    event.preventDefault();
  }
};
