import { useEffect, useState } from 'react';

import { useIntersectionObserver } from 'shared/hooks/useIntersectionObserver';

export const useStaticContent = ({
  targetSelector,
  isStaticActive = false,
}: {
  targetSelector?: string;
  isStaticActive?: boolean;
}) => {
  const [isStatic, setStatic] = useState(isStaticActive);

  useIntersectionObserver({
    targetSelector: `.${targetSelector}`,
    onAppear: () => setStatic(false),
    onHide: () => setStatic(true),
    isActive: isStaticActive && !!targetSelector,
  });

  useEffect(() => {
    if (!isStaticActive) setStatic(false);
  }, [isStaticActive]);

  return {
    isStatic,
  };
};
