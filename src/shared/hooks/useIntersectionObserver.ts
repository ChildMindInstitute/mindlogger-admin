import { useEffect } from 'react';

interface Props {
  rootSelector?: string;
  targetSelector: string;
  loadNextPage(): void;
}
export const useIntersectionObserver = ({ rootSelector, targetSelector, loadNextPage }: Props) => {
  useEffect(() => {
    const callback: IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
      if (entries.length === 0) return;

      const intersection = entries[0];
      if (intersection.intersectionRatio !== 1) return;

      loadNextPage();
    };

    const root = rootSelector === undefined ? null : document.querySelector(rootSelector);
    const options = {
      root,
      rootMargin: '0px',
      threshold: 1,
    };

    const observer = new IntersectionObserver(callback, options);
    const target = document.querySelector(targetSelector);

    if (!target) return;

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [targetSelector, loadNextPage, rootSelector]);
};
