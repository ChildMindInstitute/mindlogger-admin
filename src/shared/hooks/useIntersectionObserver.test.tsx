import { render } from '@testing-library/react';

import { useIntersectionObserver } from './useIntersectionObserver';

const instanceMap = new Map();
const observerMap = new Map();

export function intersect(element: Element, isIntersecting: boolean) {
  const cb = observerMap.get(element);

  if (cb) {
    cb([
      {
        isIntersecting,
        target: element,
        intersectionRatio: isIntersecting ? 1 : -1,
      },
    ]);
  }
}

export function getObserverOf(element: Element): IntersectionObserver {
  return instanceMap.get(element);
}

const Observed = ({ callback = () => {} }: { callback?: () => void }) => {
  useIntersectionObserver({
    targetSelector: '.observed',
    onAppear: callback,
  });

  return (
    <div data-testid="wrapper">
      <div className="observed" data-testid="observed">
        {' '}
      </div>
    </div>
  );
};

describe('useIntersectionObserver', () => {
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  beforeEach(() => {
    // @ts-ignore
    global.IntersectionObserver = jest.fn((cb, options = {}) => {
      const instance = {
        thresholds: Array.isArray(options.threshold) ? options.threshold : [options.threshold],
        root: options.root,
        rootMargin: options.rootMargin,
        observe: jest.fn((element: Element) => {
          instanceMap.set(element, instance);
          observerMap.set(element, cb);
        }),
        unobserve: jest.fn((element: Element) => {
          instanceMap.delete(element);
          observerMap.delete(element);
        }),
        disconnect: jest.fn(),
      };

      return instance;
    });
  });

  afterEach(() => {
    // @ts-ignore
    global.IntersectionObserver.mockReset();
    instanceMap.clear();
    observerMap.clear();
  });

  test('hook subscribes to the element on the page', () => {
    const { getByTestId } = render(<Observed />);
    const target = getByTestId('observed');
    const instance = getObserverOf(target);

    expect(instance.observe).toHaveBeenCalledWith(target);
  });

  test('loadNextPage should be called if component is on the screen', () => {
    const callback = jest.fn();
    const { getByTestId } = render(<Observed callback={callback} />);
    const target = getByTestId('observed');
    intersect(target, true);

    expect(callback).toBeCalled();
  });

  test('loadNextPage shouldnt be called if component isnt on the screen', () => {
    const callback = jest.fn();
    const { getByTestId } = render(<Observed callback={callback} />);
    const target = getByTestId('observed');
    intersect(target, false);

    expect(callback).toBeCalledTimes(0);
  });

  test('hook unsubscribes correctly', () => {
    const { getByTestId, unmount } = render(<Observed />);
    const target = getByTestId('observed');
    const instance = getObserverOf(target);

    expect(instance.observe).toHaveBeenCalledWith(target);

    unmount();

    expect(instance.unobserve).toHaveBeenCalledWith(target);
  });
});
