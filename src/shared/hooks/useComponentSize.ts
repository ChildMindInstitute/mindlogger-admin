import { RefObject, useLayoutEffect, useMemo, useRef, useState } from 'react';

const useResizeObserved = <ELEMENT extends HTMLElement, RETURN_TYPE>(
  refs: Array<RefObject<ELEMENT>>,
  mapper: (el: ELEMENT | null) => RETURN_TYPE,
): RETURN_TYPE[] => {
  const [dimensions, setDimensions] = useState<RETURN_TYPE[]>(() => refs.map(ref => mapper(ref.current)));

  const mapperRef = useRef(mapper);
  useLayoutEffect(() => {
    mapperRef.current = mapper;
  }, [mapper]);

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setDimensions(refs.map(ref => mapperRef.current(ref.current)));
    });

    refs.forEach(ref => {
      ref.current && resizeObserver.observe(ref.current);
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, [refs]);

  return dimensions;
};

const getElementSize = (el: HTMLElement | null) => {
  if (!el) {
    return { width: 0, height: 0 };
  }

  const { width, height } = el.getBoundingClientRect();

  return {
    width: Math.floor(width),
    height: Math.floor(height),
  };
};

export const useComponentSize = (ref: React.RefObject<HTMLElement>) => {
  const refs = useMemo(() => [ref], [ref.current]);
  const [componentSize] = useResizeObserved(refs, getElementSize);

  return componentSize;
};
