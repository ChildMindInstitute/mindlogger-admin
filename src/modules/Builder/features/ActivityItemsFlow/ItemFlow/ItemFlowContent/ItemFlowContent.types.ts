export type ItemFlowContentProps = {
  name: string;
  isStatic: boolean;
  onRemove: (index: number) => void;
  'data-testid'?: string;
};
