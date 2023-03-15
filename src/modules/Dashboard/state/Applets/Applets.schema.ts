import { BaseSchema } from 'shared/state/Base';

export type Applet = {
  id: string;
  displayName: string;
  version: string;
  description: string;
  about: string;
  image: string;
  watermark: string;
  themeId: string;
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
