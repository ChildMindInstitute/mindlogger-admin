/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { forwardRef, createRef } from 'react';
import { Box } from '@mui/material';

import { getPreloadedState } from 'shared/tests/getPreloadedState';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { RespondentDetails } from 'modules/Dashboard/types';
import { mockedRespondentDetails } from 'shared/mock';

import { StickyHeader } from './StickyHeader';

const getState = (respondentDetails: RespondentDetails) => ({
  ...getPreloadedState(),
  users: {
    allRespondents: {
      data: {
        result: [],
      },
    },
    respondentDetails: {
      data: {
        result: {
          ...respondentDetails,
        },
      },
    },
  },
});

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
        preloadedState: getState({
          nickname: mockedRespondentDetails.respondentNickname,
          secretUserId: mockedRespondentDetails.respondentSecretId,
          lastSeen: null,
        }),
      },
    );

    const title = getByText('Activities');
    expect(title).toBeInTheDocument();
    expect(title.parentElement?.parentElement).toHaveStyle({
      minHeight: '9.6rem',
      boxShadow: 'none',
    });
    expect(title).toHaveStyle({ fontSize: '3.2rem' });

    const description = getByText(
      'Respondent: 3921968c-3903-4872-8f30-a6e6a10cef36 (Mocked Respondent)',
    );
    expect(description).toBeInTheDocument();
    expect(description).toHaveStyle({ position: 'relative', padding: 0 });
  });
});
