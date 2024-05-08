import { render } from '@testing-library/react';

import { RenderIf } from './RenderIf';

describe('RenderIf', () => {
  const ChildComponent = () => <div>Child Component</div>;
  const FallbackComponent = () => <div>Fallback Component</div>;

  test('Renders children if condition is true', () => {
    const { getByText } = render(
      <RenderIf condition={true} fallback={<FallbackComponent />}>
        <ChildComponent />
      </RenderIf>,
    );

    expect(getByText('Child Component')).toBeInTheDocument();
  });

  test('Renders fallback if condition is false', () => {
    const { getByText } = render(
      <RenderIf condition={false} fallback={<FallbackComponent />}>
        <ChildComponent />
      </RenderIf>,
    );

    expect(getByText('Fallback Component')).toBeInTheDocument();
  });

  test('Renders null if fallback is not provided', () => {
    const { container } = render(
      <RenderIf condition={false}>
        <ChildComponent />
      </RenderIf>,
    );

    expect(container.firstChild).toBeNull();
  });
});
