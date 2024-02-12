import { MutableRefObject, createRef, forwardRef } from 'react';

import { act, fireEvent, render, renderHook } from '@testing-library/react';
import { Box } from '@mui/material';

import { OFFSET_TO_SET_STICKY, OFFSET_TO_UNSET_STICKY, useHeaderSticky } from './useHeaderSticky';

const ScrollableNode = forwardRef((_, ref) => (
  <Box sx={{ height: '400px', overflowY: 'auto' }} ref={ref}>
    <Box />
  </Box>
));

describe('useHeaderSticky', () => {
  const scrollToBottom = (ref: MutableRefObject<HTMLElement>, scrollTop?: number) => {
    fireEvent.scroll(ref.current, { target: { scrollTop } });
  };

  test.each`
    callback          | scrollTop                   | expected | description
    ${undefined}      | ${undefined}                | ${false} | ${'returns false by default'}
    ${scrollToBottom} | ${OFFSET_TO_SET_STICKY}     | ${true}  | ${'returns true after scroll'}
    ${scrollToBottom} | ${OFFSET_TO_SET_STICKY - 1} | ${false} | ${'returns false if scrollTop less than defaulted offset'}
  `('$description', async ({ callback, scrollTop, expected }) => {
    const ref = createRef<HTMLElement>();

    render(<ScrollableNode ref={ref} />);

    const { result } = renderHook(() => useHeaderSticky(ref));

    act(() => {
      callback?.(ref, scrollTop);
    });

    expect(result.current).toBe(expected);
  });

  test('changes returned value if scrollTop less than defaulted offset', () => {
    const ref = createRef<HTMLElement>();

    render(<ScrollableNode ref={ref} />);

    const { result } = renderHook(() => useHeaderSticky(ref));

    fireEvent.scroll(ref.current!, { target: { scrollTop: OFFSET_TO_SET_STICKY } });
    expect(result.current).toBe(true);

    fireEvent.scroll(ref.current!, { target: { scrollTop: OFFSET_TO_UNSET_STICKY - 1 } });
    expect(result.current).toBe(false);
  });
});
