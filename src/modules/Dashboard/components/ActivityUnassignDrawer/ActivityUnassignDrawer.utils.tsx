import { Trans } from 'react-i18next';
import { t } from 'i18next';

import { RespondentDetails } from 'modules/Dashboard/types';

import { GetConfirmationBodyProps } from './ActivityUnassignDrawer.types';

const getSubjectLabel = (subject?: RespondentDetails) => {
  if (!subject) {
    return '';
  }

  return subject.tag === 'Team'
    ? `${subject.nickname}`
    : `${subject.secretUserId}, ${subject.nickname}`;
};

export const getConfirmationBody = ({ selected, participantContext }: GetConfirmationBodyProps) => {
  const respondent = getSubjectLabel(selected[0]?.respondentSubject);
  const target = getSubjectLabel(selected[0]?.targetSubject);

  if (selected.length === 1) {
    return (
      <Trans i18nKey="activityUnassign.confirmationBodySingle">
        <strong>
          <>{{ respondent }}</>
        </strong>
        <strong>
          <>
            {{
              target:
                selected[0]?.respondentSubject.id === selected[0]?.targetSubject.id
                  ? t('activityUnassign.subjectSelf')
                  : target,
            }}
          </>
        </strong>
      </Trans>
    );
  }

  return participantContext === 'respondent' ? (
    <Trans i18nKey="activityUnassign.confirmationBodyMultipleTargets">
      <strong>
        <>{{ respondent }}</>
      </strong>
      <strong>
        <>{{ selectedCount: selected.length }}</>
      </strong>
    </Trans>
  ) : (
    <Trans i18nKey="activityUnassign.confirmationBodyMultipleRespondents">
      <strong>
        <>{{ selectedCount: selected.length }}</>
      </strong>
      <strong></strong>
      <strong>
        <>{{ target }}</>
      </strong>
    </Trans>
  );
};
