import { useLayoutEffect, useState } from 'react';

const getSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

export const useWindowSize = () => {
  const [size, setSize] = useState(getSize());

  useLayoutEffect(() => {
    const updateSize = () => {
      setSize(getSize());
    };
    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
};
