import { useState, useEffect, MutableRefObject } from 'react';

const OFFSET_TO_SET_STICKY = 50;
const OFFSET_TO_UNSET_STICKY = 100;

export const useHeaderSticky = (containerRef: MutableRefObject<HTMLElement | null>) => {
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const containerEl = containerRef?.current;

  useEffect(() => {
    const handleContainerScroll = () => {
      if (containerEl) {
        setIsHeaderSticky(
          (prevSticky) =>
            containerEl.scrollTop >= (prevSticky ? OFFSET_TO_SET_STICKY : OFFSET_TO_UNSET_STICKY),
        );
      }
    };
    containerEl?.addEventListener('scroll', handleContainerScroll);

    return () => containerEl?.removeEventListener('scroll', handleContainerScroll);
  }, [containerEl]);

  return isHeaderSticky;
};
