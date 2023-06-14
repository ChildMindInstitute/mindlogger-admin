export enum RoundTypeEnum {
  Practice = 'practice',
  Test = 'test',
}

export type RoundSettingsProps = {
  uiType: RoundTypeEnum;
};

export type IsPracticeRoundType = {
  isPracticeRound: boolean;
};
