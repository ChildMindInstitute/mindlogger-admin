import { t } from 'i18next';

import { ItemResponseType } from 'shared/consts';
import { Respondent } from 'redux/modules';

import { UNSUPPORTED_ITEMS } from './consts';

export const isItemUnsupported = (type: ItemResponseType) => UNSUPPORTED_ITEMS.includes(type);

export const getItemLabel = (type: ItemResponseType) => `${type}ItemTask`;

export const getUserName = (nickname = '', firstName = '', lastName = '') =>
  firstName && lastName ? `${firstName} ${lastName}` : nickname;

export const getRespondentLabel = ({
  secretId,
  nickname,
  firstName,
  lastName,
}: Partial<Respondent>) => {
  if (!secretId) return '';
  const username = getUserName(nickname, firstName, lastName);
  const label = username ? `(${username})` : '';

  return `${t('user')}: ${secretId} ${label}`;
};
