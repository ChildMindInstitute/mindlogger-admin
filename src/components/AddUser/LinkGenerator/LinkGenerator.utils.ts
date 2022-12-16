import { InviteLink } from 'components/AddUser/LinkGenerator/LinkGenerator.types';

export const formatLink = ({ requireLogin, inviteId }: InviteLink) =>
  requireLogin
    ? `web-staging.mindlogger.org/join/${inviteId}`
    : `web-staging.mindlogger.org/applet/public/${inviteId}`;
