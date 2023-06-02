export enum OverviewInstructionType {
  FlankerGeneral = 'general',
  FlankerPractice = 'practice',
  FlankerTest = 'test',
}

export type OverviewInstructionProps = {
  instructionType: OverviewInstructionType;
  description: string;
};
