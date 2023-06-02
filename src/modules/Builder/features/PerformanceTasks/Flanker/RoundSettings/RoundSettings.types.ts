export enum RoundUiType {
  Practice,
  Test,
}

export type RoundSettingsProps = {
  uiType: RoundUiType;
};

export type RoundType = {
  isPracticeRound: boolean;
};
