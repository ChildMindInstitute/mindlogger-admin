import i18n from 'i18n';

export const getHeadCells = () => {
  const { t } = i18n;

  return [
    {
      id: 'id',
      label: t('participantDetails.subjectOfActivity'),
      width: '40%',
      enableSort: false,
    },
    {
      id: 'submissionCount',
      label: t('participantDetails.submissions'),
      maxWidth: '9rem',
      enableSort: false,
    },
    {
      id: 'currentlyAssigned',
      label: t('participantDetails.currentlyAssigned'),
      maxWidth: '9rem',
      enableSort: false,
    },
    {
      id: 'actions',
      label: '',
      width: '1%',
      enableSort: false,
    },
  ];
};
