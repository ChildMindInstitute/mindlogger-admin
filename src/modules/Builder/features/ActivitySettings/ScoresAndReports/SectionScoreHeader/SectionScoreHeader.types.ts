import { DraggableProvided } from 'react-beautiful-dnd';

export type SectionScoreHeaderProps = {
  onRemove: () => void;
  name: string;
  title: string;
  open: boolean;
  dragHandleProps?: DraggableProvided['dragHandleProps'];
};
