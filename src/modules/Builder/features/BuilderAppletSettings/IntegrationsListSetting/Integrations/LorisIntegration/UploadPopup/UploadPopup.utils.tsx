import { Box } from '@mui/material';

import i18n from 'i18n';
import { StyledBodyLarge, StyledTitleMedium, theme, variables } from 'shared/styles';
import { LorisUserAnswerVisit, LorisUsersVisit, LorisUsersVisits } from 'modules/Builder/api';

import { UploadSteps, GetScreensProps, UploadDataForm } from './UploadPopup.types';
import { ConnectionInfo } from '../ConnectionInfo';
import { Visits } from './Visits';

const { t } = i18n;

export const getScreens = ({
  visitsList,
  onClose,
  setStep,
  handleNextClick,
  handleSubmitVisits,
}: GetScreensProps) => [
  {
    leftButtonText: t('cancel'),
    rightButtonText: t('confirm'),
    content: (
      <>
        <StyledTitleMedium sx={{ color: variables.palette.on_surface, mb: theme.spacing(2.4) }}>
          {t('loris.dataUploadConfirmation')}
        </StyledTitleMedium>
        <Box sx={{ mb: theme.spacing(2.4) }}>
          <ConnectionInfo />
        </Box>
        <StyledTitleMedium sx={{ color: variables.palette.on_surface, mb: theme.spacing(2.4) }}>
          {t('loris.dataUploadDescription')}
        </StyledTitleMedium>
      </>
    ),
    leftButtonClick: onClose,
    rightButtonClick: handleNextClick,
  },
  {
    leftButtonText: t('back'),
    rightButtonText: t('upload'),
    content: <Visits visitsList={visitsList} />,
    leftButtonClick: () => setStep(UploadSteps.CurrentConnectionInfo),
    rightButtonClick: handleSubmitVisits,
    width: '80rem',
  },
  {
    leftButtonText: t('back'),
    rightButtonText: t('ok'),
    content: (
      <StyledTitleMedium sx={{ mb: theme.spacing(2.4) }}>
        {t('loris.noDataToUpload')}
      </StyledTitleMedium>
    ),
    leftButtonClick: () => setStep(UploadSteps.CurrentConnectionInfo),
    rightButtonClick: onClose,
  },
  {
    rightButtonText: t('ok'),
    content: (
      <StyledTitleMedium
        sx={{ color: variables.palette.on_surface, mb: theme.spacing(2.4), whiteSpace: 'pre-line' }}
      >
        {t('loris.successMessage')}
      </StyledTitleMedium>
    ),
    rightButtonClick: onClose,
  },
  {
    rightButtonText: t('retry'),
    content: (
      <StyledBodyLarge sx={{ mb: theme.spacing(2.4), color: variables.palette.semantic.error }}>
        {t('errorFallback.somethingWentWrong')}
      </StyledBodyLarge>
    ),
    rightButtonClick: () => setStep(UploadSteps.SelectVisits),
    leftButtonText: t('cancel'),
    leftButtonClick: onClose,
  },
];

export const formatData = ({ activityVisits, answers }: LorisUsersVisits): LorisUserAnswerVisit[] =>
  answers.map(({ activityId, userId, ...restAnswerData }) => {
    const activityUsersVisits = activityVisits[activityId];

    if (!activityUsersVisits) {
      return {
        ...restAnswerData,
        activityId,
        userId,
        visits: [],
        visit: '',
        selected: true,
      };
    }

    const userVisits = activityUsersVisits.find(
      (activityUserVisits) => activityUserVisits?.userId === userId,
    );

    return {
      ...restAnswerData,
      activityId,
      userId,
      visits: userVisits?.visits ?? [],
      visit: '',
      selected: true,
    };
  });

export const filteredData = (form: UploadDataForm): LorisUsersVisit[] => {
  const filteredData = form?.visitsForm.reduce(
    (acc: { [key: string]: LorisUsersVisit }, activityAnswer) => {
      if (!activityAnswer.selected || !activityAnswer.visit) return acc;
      if (!acc[activityAnswer.userId]) {
        acc[activityAnswer.userId] = {
          userId: activityAnswer.userId,
          secretUserId: activityAnswer.secretUserId,
          activities: [],
        };
      }

      acc[activityAnswer.userId].activities.push({
        activityId: activityAnswer.activityId,
        activityName: activityAnswer.activityName,
        answerId: activityAnswer.answerId,
        version: activityAnswer.version,
        completedDate: activityAnswer.completedDate,
        visit: activityAnswer.visit,
      });

      return acc;
    },
    {},
  );

  return Object.values(filteredData);
};
