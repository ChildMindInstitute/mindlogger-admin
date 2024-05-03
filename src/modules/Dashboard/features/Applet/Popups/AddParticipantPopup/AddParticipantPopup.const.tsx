import { t } from 'i18next';

import { Svg } from 'shared/components';
import { AccountType } from 'modules/Dashboard/types/Dashboard.types';
import { ParticipantTag } from 'shared/consts';

export const defaultValues = {
  accountType: AccountType.Full,
  firstName: '',
  lastName: '',
  nickname: '',
  email: '',
  secretUserId: '',
  tag: ParticipantTag.None,
};

export const toggleButtons = [
  {
    value: AccountType.Full,
    label: t('fullAccount'),
    description: t('fullAccountDescription'),
    icon: <Svg width="32" height="32" id="full-account" />,
  },
  {
    value: AccountType.Limited,
    label: t('limitedAccount'),
    description: t('limitedAccountDescription'),
    icon: <Svg width="32" height="32" id="limited-account" />,
  },
];

export const RESPONDENT_ALREADY_INVITED = 'Respondent already invited.';
