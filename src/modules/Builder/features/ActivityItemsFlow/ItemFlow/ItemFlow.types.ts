export type ItemFlowProps = {
  name: string;
  index: number;
  isStaticActive: boolean;
  onDuplicate?: (index: number) => void;
  onRemove: () => void;
};
