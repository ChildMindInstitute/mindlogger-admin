import { ReactNode } from 'react';
import { DefaultTFuncReturn } from 'i18next';

export enum ActivitySettingsOptionsItems {
  ScoresAndReports = 'scoresAndReports',
  SubscalesConfiguration = 'subscalesConfiguration',
}

export type ActivitySettingsOptions = {
  name: string;
  title: string | DefaultTFuncReturn | JSX.Element;
  icon: ReactNode;
  path: string;
};

export type ActivitySettingsScore = {
  name?: string;
};

export type ActivitySettingsSection = {
  name?: string;
};

export type ActivitySettingsSubscale = {
  name?: string;
};

export type ActivitySettingsForm = {
  generateReport: boolean;
  showScoreSummary: boolean;
  scores?: ActivitySettingsScore[];
  sections?: ActivitySettingsSection[];
  subscales?: ActivitySettingsSubscale[];
};
