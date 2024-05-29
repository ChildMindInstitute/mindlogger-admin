/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { forwardRef, createRef } from 'react';
import { Box } from '@mui/material';

import { getPreloadedState } from 'shared/tests/getPreloadedState';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedRespondentId } from 'shared/mock';
import { initialStateData } from 'shared/state';

import { StickyHeader } from './StickyHeader';

const preloadedState = {
  ...getPreloadedState(),
  users: {
    allRespondents: {
      data: {
        result: [],
      },
    },
    subjectDetails: {
      ...initialStateData,
      data: {
        result: {
          nickname: 'Mocked Respondent',
          secretUserId: mockedRespondentId,
          lastSeen: '2023-12-11T08:40:41.424000',
        },
      },
    },
    respondentDetails: initialStateData,
  },
};

const ScrollableNode = forwardRef(({ children }, ref) => (
  <Box sx={{ height: '400px', overflowY: 'auto' }} ref={ref}>
    {children}
  </Box>
));

describe('StickyHeader', () => {
  test('should render component with proper styles', async () => {
    const ref = createRef<HTMLElement | null>();

    const { getByText } = renderWithProviders(
      <ScrollableNode ref={ref}>
        <StickyHeader containerRef={ref} data-testid="test" />
      </ScrollableNode>,
      {
        preloadedState,
      },
    );

    const description = getByText(
      'Respondent: b60a142d-2b7f-4328-841c-dbhjhj4afcf1c7 (Mocked Respondent)',
    );
    expect(description).toBeInTheDocument();
    expect(description).toHaveStyle({ position: 'relative', padding: 0 });
  });
});
