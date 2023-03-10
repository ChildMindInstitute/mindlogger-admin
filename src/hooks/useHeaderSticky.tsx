import { useState, useEffect, MutableRefObject } from 'react';

export const useHeaderSticky = (containerRef: MutableRefObject<HTMLElement | null>) => {
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const containerEl = containerRef?.current;

  const handleContainerScroll = () => {
    if (containerEl) {
      setIsHeaderSticky(containerEl.scrollTop >= 50);
    }
  };

  useEffect(() => {
    containerEl?.addEventListener('scroll', handleContainerScroll);

    return () => containerEl?.removeEventListener('scroll', handleContainerScroll);
  }, [containerEl]);

  return isHeaderSticky;
};
