import { createRef, forwardRef, useImperativeHandle } from 'react';
import { render, renderHook } from '@testing-library/react';

import { useIsTextNodeEllipsed } from './useIsTextNodeEllipsed';

const TextNode = forwardRef(({ text }: { text: string }, ref) => {
  useImperativeHandle(ref, () => ({
    offsetWidth: 200,
    scrollWidth: text.length > 20 ? 300 : 100,
  }));

  return null;
});

describe('useIsTextNodeEllipsed', () => {
  test.each`
    text                                                                                  | expected | description
    ${'very very long text ewfafeawafwefawefewafeawfewafeawfaewfewafewafewafeawfewafewa'} | ${true}  | ${'long text is ellipsed'}
    ${'short text'}                                                                       | ${false} | ${'short text is not ellipsed'}
  `('$description', ({ text, sxProps, expected }) => {
    const ref = createRef<HTMLElement>();

    render(<TextNode text={text} ref={ref} />);

    const { result } = renderHook(() => useIsTextNodeEllipsed(ref, [ref.current, text]));

    expect(result.current).toBe(expected);
  });
});
