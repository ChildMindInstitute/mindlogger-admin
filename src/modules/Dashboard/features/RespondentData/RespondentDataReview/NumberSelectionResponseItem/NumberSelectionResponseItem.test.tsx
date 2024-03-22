// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

import { NumberSelectionResponseItem } from './NumberSelectionResponseItem';

const dataTestid = 'respondents-review-activity-items-response';

describe('NumberSelectionResponseItem', () => {
  test.each`
    answer                  | expected
    ${{ value: '123' }}     | ${'123'}
    ${{ value: 123 }}       | ${'123'}
    ${{ value: 0 }}         | ${'0'}
    ${{ value: null }}      | ${''}
    ${{ value: undefined }} | ${''}
  `('render text response item for answer = $answer', ({ answer, expected }) => {
    renderWithProviders(<NumberSelectionResponseItem answer={answer} data-testid={dataTestid} />);

    const item = screen.getByTestId(dataTestid);
    expect(item).toBeInTheDocument();
    expect(item).toHaveTextContent(expected);
  });
});
