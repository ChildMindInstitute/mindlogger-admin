import { Box } from '@mui/material';

import i18n from 'i18n';
import { StyledBodyLarge, StyledTitleMedium, theme, variables } from 'shared/styles';
import { LorisActivityForm, LorisActivityResponse, LorisUsersVisit } from 'modules/Builder/api';

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

export const formatData = (
  usersVisits: LorisUsersVisit<LorisActivityResponse>[],
): LorisUsersVisit<LorisActivityResponse>[] =>
  usersVisits.reduce((acc: LorisUsersVisit[], { activities, ...userData }) => {
    // TODO: move this logic to the backend
    const allVisits = activities.reduce(
      (visitsAcc, { activityId, visits }) => {
        if (visits.length) {
          visitsAcc[activityId] = visitsAcc[activityId]
            ? visitsAcc[activityId].concat(visits)
            : visits;
        }

        return visitsAcc;
      },
      {} as Record<string, string[]>,
    );

    const filteredActivities = activities
      .filter(({ visits }) => !visits.length)
      .map((activity) => ({
        ...activity,
        visits: allVisits[activity.activityId] || [],
        visit: '',
        selected: true,
      }));

    if (!filteredActivities.length) {
      return acc;
    }

    acc.push({ ...userData, activities: filteredActivities });

    return acc;
  }, []);

export const filteredData = (form: UploadDataForm): LorisUsersVisit<LorisActivityForm>[] =>
  form.visitsForm
    .filter((userVisit) => userVisit.activities.some((activity) => activity.selected))
    .map((userVisit) => ({
      ...userVisit,
      activities: userVisit.activities.reduce((acc: LorisActivityForm[], activity) => {
        if (activity.selected) {
          // eslint-disable-next-line unused-imports/no-unused-vars
          const { selected, visits, ...rest } = activity;
          acc.push(rest);
        }

        return acc;
      }, []),
    }));
