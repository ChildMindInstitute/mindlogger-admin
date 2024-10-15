import i18n from 'i18n';

export const getHeadCells = () => {
  const { t } = i18n;

  return [
    {
      id: 'id',
      label: <></>,
      enableSort: false,
      width: '4.8rem',
    },
    {
      id: 'respondentSubject',
      label: t('activityUnassign.respondent'),
      width: '50%',
      enableSort: false,
    },
    {
      id: 'targetSubject',
      label: t('activityUnassign.subject'),
      width: '50%',
      enableSort: false,
    },
  ];
};
