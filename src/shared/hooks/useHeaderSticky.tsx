import { useState, useEffect, MutableRefObject } from 'react';

export const OFFSET_TO_SET_STICKY = 100;
export const OFFSET_TO_UNSET_STICKY = 50;

export const useHeaderSticky = (
  containerRef: MutableRefObject<HTMLElement | null>,
  offsetToSetSticky = OFFSET_TO_SET_STICKY,
  offsetToUnsetSticky = OFFSET_TO_UNSET_STICKY,
) => {
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const containerEl = containerRef?.current;

  useEffect(() => {
    const handleContainerScroll = () => {
      if (containerEl) {
        setIsHeaderSticky(
          (prevSticky) =>
            containerEl.scrollTop >= (prevSticky ? offsetToUnsetSticky : offsetToSetSticky),
        );
      }
    };
    containerEl?.addEventListener('scroll', handleContainerScroll);

    return () => containerEl?.removeEventListener('scroll', handleContainerScroll);
  }, [containerEl, offsetToSetSticky, offsetToUnsetSticky]);

  return isHeaderSticky;
};
