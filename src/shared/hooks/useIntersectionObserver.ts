import { useEffect } from 'react';

interface Props {
  rootSelector?: string;
  targetSelector: string;
  onAppear?(): void;
  onHide?(): void;
}
export const useIntersectionObserver = ({
  rootSelector,
  targetSelector,
  onAppear,
  onHide,
}: Props) => {
  useEffect(() => {
    const callback: IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
      if (entries.length === 0) return;

      const intersection = entries[0];
      if (!intersection.isIntersecting) return onHide?.();

      onAppear?.();
    };

    const root = rootSelector === undefined ? null : document.querySelector(rootSelector);
    const options = {
      root,
      rootMargin: '0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(callback, options);
    const target = document.querySelector(targetSelector);

    if (!target) return;

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [targetSelector, onAppear, onHide, rootSelector]);
};
