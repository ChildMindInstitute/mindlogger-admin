export enum ScoreConditionRowType {
  Score,
  Section,
}

export type ConditionContentProps = {
  name: string;
  type: ScoreConditionRowType;
};
