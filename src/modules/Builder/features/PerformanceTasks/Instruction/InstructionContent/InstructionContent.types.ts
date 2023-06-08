import { InstructionProps } from '../Instruction.types';

export type InstructionContentProps = Omit<InstructionProps, 'title' | 'type'> & {
  hasError?: boolean;
};
