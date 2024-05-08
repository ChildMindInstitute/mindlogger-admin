import { RenderIfProps } from './RenderIf.types';

/**
 * Render a component tree if a condition is met, otherwise render a fallback component. By default, the fallback is null.
 */
export const RenderIf = ({ condition, children, fallback }: RenderIfProps) => {
  if (condition) {
    return children;
  }

  return fallback ?? null;
};
