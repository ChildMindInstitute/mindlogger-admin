export type ActivitySettingsScore = {
  name?: string;
};

export type ActivitySettingsSection = {
  name?: string;
};

export type ActivitySettingsForm = {
  generateReport: boolean;
  showScoreSummary: boolean;
  scores?: ActivitySettingsScore[];
  sections?: ActivitySettingsSection[];
};
