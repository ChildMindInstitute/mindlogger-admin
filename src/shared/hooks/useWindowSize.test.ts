import { act, renderHook } from '@testing-library/react';

import { useWindowSize } from './useWindowSize';

describe('useWindowSize', () => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  test('should return correct height and width for window', () => {
    const { result } = renderHook(() => useWindowSize());

    expect(result.current.width).toEqual(windowWidth);
    expect(result.current.height).toEqual(windowHeight);
  });

  test.each`
    width          | height          | expectedSize                             | description
    ${windowWidth} | ${1000}         | ${{ width: windowWidth, height: 1000 }}  | ${'should update height after resize'}
    ${1000}        | ${windowHeight} | ${{ width: 1000, height: windowHeight }} | ${'should update width after resize'}
    ${1000}        | ${1000}         | ${{ width: 1000, height: 1000 }}         | ${'should update height and width after resize'}
  `('$description', ({ width, height, expectedSize }) => {
    const { result } = renderHook(() => useWindowSize());

    act(() => {
      window.innerWidth = width;
      window.innerHeight = height;
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toEqual(expectedSize);
  });
});
