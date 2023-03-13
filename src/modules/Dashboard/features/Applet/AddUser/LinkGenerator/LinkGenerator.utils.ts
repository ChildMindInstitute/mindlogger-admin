import { InviteLink } from './LinkGenerator.types';

//TODO change base url

export const formatLink = ({ requireLogin, inviteId }: InviteLink) =>
  requireLogin
    ? `web-staging.mindlogger.org/join/${inviteId}`
    : `web-staging.mindlogger.org/applet/public/${inviteId}`;
