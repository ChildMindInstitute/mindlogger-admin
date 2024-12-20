import { Trans } from 'react-i18next';
import { t } from 'i18next';

import { SubjectDetails } from 'modules/Dashboard/types';

import { ActivityUnassignFormValues } from './ActivityUnassignDrawer.types';

const getSubjectLabel = (subject?: SubjectDetails) => {
  if (!subject) {
    return '';
  }

  return subject.tag === 'Team'
    ? `${subject.nickname}`
    : `${subject.secretUserId}, ${subject.nickname}`;
};

export const getConfirmationBody = ({ selected }: ActivityUnassignFormValues) => {
  if (!selected.length) return;

  const i18nKeyPrefix = `activityUnassign.confirmationBody${
    selected[0].activityFlowId ? 'Flow' : 'Activity'
  }`;
  const respondent = getSubjectLabel(selected[0].respondentSubject);
  const target = getSubjectLabel(selected[0].targetSubject);

  if (selected.length === 1) {
    return (
      <Trans i18nKey={`${i18nKeyPrefix}Single`}>
        <strong>
          <>{{ respondent }}</>
        </strong>
        <strong>
          <>
            {{
              target:
                selected[0].respondentSubject.id === selected[0].targetSubject.id
                  ? t('activityUnassign.subjectSelf')
                  : target,
            }}
          </>
        </strong>
      </Trans>
    );
  }

  let hasMultipleRespondents = false;
  let hasMultipleTargets = false;
  for (const assignment of selected) {
    if (assignment.respondentSubject.id !== selected[0].respondentSubject.id) {
      hasMultipleRespondents = true;
    }
    if (assignment.targetSubject.id !== selected[0].targetSubject.id) {
      hasMultipleTargets = true;
    }
  }

  if (hasMultipleRespondents && hasMultipleTargets) {
    return (
      <Trans i18nKey={`${i18nKeyPrefix}Multiple`}>
        <strong>
          <>{{ selectedCount: selected.length }}</>
        </strong>
        <strong>
          <>{{ selectedCount: selected.length }}</>
        </strong>
      </Trans>
    );
  }
  if (hasMultipleRespondents) {
    return (
      <Trans i18nKey={`${i18nKeyPrefix}MultipleRespondents`}>
        <strong>
          <>{{ selectedCount: selected.length }}</>
        </strong>
        <strong>
          <>{{ target }}</>
        </strong>
      </Trans>
    );
  }
  if (hasMultipleTargets) {
    return (
      <Trans i18nKey={`${i18nKeyPrefix}MultipleTargets`}>
        <strong>
          <>{{ respondent }}</>
        </strong>
        <strong>
          <>{{ selectedCount: selected.length }}</>
        </strong>
      </Trans>
    );
  }
};
