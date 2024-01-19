// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

import { TextResponseItem } from './TextResponseItem';

const dataTestid = 'respondents-review-activity-items-response';

describe('TextResponseItem', () => {
  test.each`
    answer           | expected
    ${'69769'}       | ${'69769'}
    ${'Hello world'} | ${'Hello world'}
    ${9869}          | ${'9869'}
    ${null}          | ${''}
    ${undefined}     | ${''}
  `('render text response item for answer = $answer', ({ answer, expected }) => {
    renderWithProviders(<TextResponseItem answer={answer} data-testid={dataTestid} />);

    const item = screen.getByTestId(dataTestid);
    expect(item).toBeInTheDocument();
    expect(item).toHaveTextContent(expected);
  });
});
