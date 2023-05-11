import { SingleApplet } from 'shared/state';

export type ServerUrlOption = {
  name: string;
  value: string;
};

export type SignInRefreshTokenArgs = {
  refreshToken: string | null;
};

export type AppletId = { appletId: string };

export type AppletIdWithEncryption = { appletId: string; encryption: string };

export type AppletBody = AppletId & {
  body: SingleApplet;
};
