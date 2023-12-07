import { useEffect } from 'react';

type UseIntersectionObserverProps = {
  rootSelector?: string;
  targetSelector: string;
  isActive?: boolean;
  onAppear?(): void;
  onHide?(): void;
  hasTrigger?: boolean;
};

export const useIntersectionObserver = ({
  rootSelector,
  targetSelector,
  isActive = true,
  onAppear,
  onHide,
  hasTrigger = false,
}: UseIntersectionObserverProps) => {
  useEffect(() => {
    if (!isActive) return;

    const callback: IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
      if (entries.length === 0) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) return onAppear?.();

        return onHide?.();
      });
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
  }, [targetSelector, onAppear, onHide, rootSelector, isActive, hasTrigger]);
};
