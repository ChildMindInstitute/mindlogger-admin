export type RenderIfProps = {
  /**
   * Whether to render the children
   */
  condition: boolean;

  /**
   * The component tree to render if the condition is met
   */
  children: JSX.Element;

  /**
   * The component to render if the condition is not met. By default, this is null so nothing will be rendered
   */
  fallback?: JSX.Element;
};
