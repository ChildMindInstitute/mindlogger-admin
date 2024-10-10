import i18n from 'i18n';

export const getHeadCells = () => {
  const { t } = i18n;

  return [
    {
      id: 'id',
      label: t('participantDetails.subjectOfActivity'),
      width: '43%',
      enableSort: false,
    },
    {
      id: 'submissionCount',
      label: t('participantDetails.submissions'),
      width: '21%',
      enableSort: false,
    },
    {
      id: 'currentlyAssigned',
      label: t('participantDetails.currentlyAssigned'),
      width: '21%',
      enableSort: false,
    },
    {
      id: 'actions',
      label: '',
      width: '15%',
      enableSort: false,
    },
  ];
};
