import { useEffect, useState, RefObject } from 'react';

const isTextNodeEllipsed = (node: HTMLElement) => node.offsetWidth < node.scrollWidth;

export const useIsTextNodeEllipsed = (textNodeRef: RefObject<HTMLElement>, deps: unknown[] = []) => {
  const [isEllipsed, setIsEllipsed] = useState(false);

  useEffect(() => {
    if (!textNodeRef.current) {
      return;
    }

    setIsEllipsed(isTextNodeEllipsed(textNodeRef.current));
  }, [...deps]);

  return isEllipsed;
};
