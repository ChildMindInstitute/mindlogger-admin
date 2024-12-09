import { render, screen } from '@testing-library/react';

import { StyledMaybeEmpty } from 'shared/styles/styledComponents/MaybeEmpty';

describe('MaybeEmpty', () => {
  test('should render component when containing truthy value', () => {
    const value = 'truthy value';
    render(<StyledMaybeEmpty>{value}</StyledMaybeEmpty>);

    expect(screen.queryByText(value)).toBeVisible();
  });

  test('should render component when containing numeric 0', () => {
    const value = 0;
    render(<StyledMaybeEmpty>{value}</StyledMaybeEmpty>);

    expect(screen.queryByText(value)).toBeVisible();
  });

  test('should render "--" when containing falsey value != 0', () => {
    const value = null;
    const testId = 'testElement';

    const { getByTestId } = render(
      <StyledMaybeEmpty data-testid={testId}>{value}</StyledMaybeEmpty>,
    );
    const el = getByTestId(testId);
    expect(window.getComputedStyle(el, '::after')['content'] === '--');
  });

  it('should render empty accessibility label when containing falsey value != 0', () => {
    const value = null;
    render(<StyledMaybeEmpty>{value}</StyledMaybeEmpty>);

    expect(screen.getByLabelText('--')).toBeInTheDocument();
  });

  it('should render loading accessibility label when in loading state', () => {
    const value = null;
    render(<StyledMaybeEmpty isLoading={true}>{value}</StyledMaybeEmpty>);

    expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
  });
});
