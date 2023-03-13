import { BaseSchema } from 'shared/state/Base';

export type Applet = {
  id: number;
  displayName: 'string';
  version: 'string';
  description: 'string';
  about: 'string';
  image: 'string';
  watermark: 'string';
  themeId: number;
  reportServerIp: string;
  reportPublicKey: string;
  reportRecipients: string[];
  reportIncludeUserId: boolean;
  reportIncludeCaseId: boolean;
  reportEmailBody: string;
  createdAt: string;
  updatedAt: string;
};

export type AppletsSchema = {
  applets: BaseSchema<{ result: Applet[]; count: number } | null>;
};
