import { BaseSchema } from 'redux/modules/Base';

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
};

export type AppletsSchema = {
  applets: BaseSchema<Applet[] | null>;
};
