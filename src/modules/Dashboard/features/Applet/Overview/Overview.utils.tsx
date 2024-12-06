import { PropsOf } from '@emotion/react';
import { Button } from '@mui/material';
import { formatDistanceStrict, Locale } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { generatePath } from 'react-router-dom';

import i18n from 'i18n';
import { GetAppletSubmissionsResponse } from 'api';
import { ParticipantSnippet } from 'modules/Dashboard/components';
import { QuickStats } from 'modules/Dashboard/features/Applet/Overview/QuickStats';
import { Svg } from 'shared/components';
import { StyledFlexAllCenter, StyledMaybeEmpty, theme, variables } from 'shared/styles';
import { page } from 'resources';

const getI18nLocale = (language: string): Locale => {
  if (language === 'fr') {
    return fr;
  }

  return enUS;
};

export function mapResponseToQuickStatProps(
  { participantsCount, submissionsCount }: GetAppletSubmissionsResponse = {
    participantsCount: 0,
    submissionsCount: 0,
    submissions: [],
  },
  commonProps: {
    onPressAddParticipant?: () => void;
  },
): PropsOf<typeof QuickStats> {
  return {
    stats: [
      {
        children: (
          <Button
            onClick={commonProps.onPressAddParticipant}
            sx={{ minWidth: 'unset', p: 1.4, placeSelf: 'center' }}
            variant="tonal"
          >
            <Svg aria-label={i18n.t('addParticipant')} id="add" width={20} height={20} />
          </Button>
        ),
        label: i18n.t('appletOverview.statParticipants'),
        tooltip: i18n.t('appletOverview.statParticipantsTooltip'),
        value: (participantsCount ?? 0).toLocaleString(i18n.language),
      },
      {
        label: i18n.t('appletOverview.statSubmissions'),
        tooltip: i18n.t('appletOverview.statSubmissionsTooltip'),
        value: (submissionsCount ?? 0).toLocaleString(i18n.language),
      },
    ],
  };
}

export function mapResponseToSubmissionsTableProps(
  { submissions = [] }: GetAppletSubmissionsResponse,
  {
    onViewSubmission,
  }: {
    onViewSubmission: (params: { path: string }) => void;
  },
) {
  return {
    'data-testid': 'recent-submissions',
    columns: [
      { id: 'activity', label: i18n.t('appletOverview.columnActivity') },
      { id: 'respondent', label: i18n.t('appletOverview.columnRespondent') },
      { id: 'subject', label: i18n.t('appletOverview.columnSubject') },
      { id: 'submissionDate', label: i18n.t('appletOverview.columnSubmissionDate') },
    ],
    rows:
      submissions.length > 0
        ? submissions.map(
            ({
              appletId,
              activityId,
              activityName,
              createdAt,
              sourceSubjectId,
              sourceSecretUserId,
              sourceNickname,
              sourceSubjectTag,
              targetSubjectId,
              targetSecretUserId,
              targetNickname,
              targetSubjectTag,
            }) => {
              const createdAtDate = new Date(createdAt);
              const path = generatePath(page.appletParticipantActivityDetailsDataSummary, {
                activityId,
                appletId,
                subjectId: targetSubjectId,
              });
              const handleClick = () => {
                onViewSubmission({ path });
              };

              return {
                rowState: { value: 'has-hover' },
                activity: {
                  onClick: handleClick,
                  content: () => <StyledMaybeEmpty>{activityName}</StyledMaybeEmpty>,
                  value: true,
                },
                respondent: {
                  onClick: handleClick,
                  content: () => (
                    <StyledMaybeEmpty>
                      <ParticipantSnippet
                        tag={sourceSubjectTag}
                        secretId={sourceSecretUserId}
                        nickname={sourceNickname}
                      />
                    </StyledMaybeEmpty>
                  ),
                  sx: { maxWidth: theme.spacing(31.2) },
                  value: true,
                },
                subject: {
                  onClick: handleClick,
                  content: () => (
                    <StyledMaybeEmpty>
                      {sourceSubjectId === targetSubjectId ? (
                        i18n.t('appletOverview.labelSelf')
                      ) : (
                        <ParticipantSnippet
                          tag={targetSubjectTag}
                          secretId={targetSecretUserId}
                          nickname={targetNickname}
                        />
                      )}
                    </StyledMaybeEmpty>
                  ),
                  sx: { maxWidth: theme.spacing(31.2) },
                  value: true,
                },
                submissionDate: {
                  onClick: handleClick,
                  content: () => (
                    <StyledMaybeEmpty>
                      {formatDistanceStrict(
                        new Date(
                          createdAtDate.getTime() - createdAtDate.getTimezoneOffset() * 60000,
                        ),
                        new Date(),
                        {
                          addSuffix: true,
                          locale: getI18nLocale(i18n.language),
                        },
                      )}
                    </StyledMaybeEmpty>
                  ),
                  value: true,
                },
              };
            },
          )
        : [
            {
              activity: {
                colSpan: 5,
                content: () => (
                  <StyledFlexAllCenter sx={{ color: variables.palette.outline }}>
                    {i18n.t('appletOverview.noDataYet')}
                  </StyledFlexAllCenter>
                ),
                sx: { boxShadow: `inset 0 2px 0 -0 ${variables.palette.surface_variant}` },
                value: true,
              },
            },
          ],
  };
}
