import { PropsOf } from '@emotion/react';
import { IconButton } from '@mui/material';
import { formatDistanceStrict } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';

import i18n from 'i18n';
import { GetAppletSubmissionsResponse } from 'api';
import { ParticipantSnippet } from 'modules/Dashboard/components';
import { QuickStats } from 'modules/Dashboard/features/Applet/Overview/QuickStats';
import { StyledMaybeEmpty } from 'shared/styles/styledComponents/MaybeEmpty';
import { StyledFlexAllCenter, StyledFlexTopCenter, theme, variables } from 'shared/styles';
import { Svg } from 'shared/components';

const locales = { en: enUS, fr };

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
        label: i18n.t('appletOverview.statParticipants'),
        icon: 'profile' as const,
        value: (
          <StyledFlexTopCenter component="span" sx={{ gap: 1.6 }}>
            {(participantsCount ?? 0).toLocaleString(i18n.language)}

            <IconButton onClick={commonProps.onPressAddParticipant}>
              <Svg aria-label={i18n.t('addParticipant')} id="add" width={20} height={20} />
            </IconButton>
          </StyledFlexTopCenter>
        ),
      },
      {
        label: i18n.t('appletOverview.statSubmissions'),
        icon: 'fileCheck' as const,
        value: (submissionsCount ?? 0).toLocaleString(i18n.language),
      },
    ],
  };
}

export function mapResponseToSubmissionsTableProps({
  submissions = [],
  submissionsCount = 0,
}: GetAppletSubmissionsResponse) {
  return {
    'data-testid': 'recent-submissions',
    columns: [
      { id: 'activity', label: i18n.t('appletOverview.columnActivity') },
      { id: 'respondent', label: i18n.t('appletOverview.columnRespondent') },
      { id: 'subject', label: i18n.t('appletOverview.columnSubject') },
      { id: 'submissionDate', label: i18n.t('appletOverview.columnSubmissionDate') },
    ],
    count: submissionsCount ?? submissions?.length,
    handleRequestSort: () => {},
    order: 'desc' as const,
    orderBy: '',
    rows:
      submissions.length > 0
        ? submissions.map(
            ({
              activityName,
              createdAt,
              sourceSubjectId,
              sourceNickname,
              sourceSubjectTag,
              targetSubjectId,
              targetNickname,
              targetSubjectTag,
            }) => {
              const createdAtDate = new Date(createdAt);

              return {
                activity: {
                  content: () => <StyledMaybeEmpty>{activityName}</StyledMaybeEmpty>,
                  value: true,
                },
                respondent: {
                  content: () => (
                    <StyledMaybeEmpty>
                      <ParticipantSnippet
                        tag={sourceSubjectTag}
                        secretId={sourceSubjectId}
                        nickname={sourceNickname}
                      />
                    </StyledMaybeEmpty>
                  ),
                  sx: { maxWidth: theme.spacing(31.2) },
                  value: true,
                },
                subject: {
                  content: () => (
                    <StyledMaybeEmpty>
                      {sourceSubjectId === targetSubjectId ? (
                        i18n.t('appletOverview.labelSelf')
                      ) : (
                        <ParticipantSnippet
                          tag={targetSubjectTag}
                          secretId={targetSubjectId}
                          nickname={targetNickname}
                        />
                      )}
                    </StyledMaybeEmpty>
                  ),
                  sx: { maxWidth: theme.spacing(31.2) },
                  value: true,
                },
                submissionDate: {
                  content: () => (
                    <StyledMaybeEmpty>
                      {formatDistanceStrict(
                        new Date(
                          createdAtDate.getTime() - createdAtDate.getTimezoneOffset() * 60000,
                        ),
                        new Date(),
                        {
                          addSuffix: true,
                          locale: locales[i18n.language as keyof typeof locales],
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
