import { useEffect } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { HeaderOptions } from 'modules/Dashboard/components/HeaderOptions';
import { useAppDispatch } from 'redux/store';
import { LinkedTabs, Spinner } from 'shared/components';
import { workspaces } from 'shared/state';
import { StyledBody } from 'shared/styles';
import { applet as appletState } from 'shared/state';
import { applets, users } from 'modules/Dashboard/state';
import { getSubjectDetails } from 'modules/Dashboard/state/Users/Users.thunk';
import { page } from 'resources';
import { ParticipantSnippet, ParticipantSnippetVariant } from 'modules/Dashboard/components';

import { useParticipantDetailsTabs } from './ParticipantDetails.hooks';

export const ParticipantDetails = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { appletId, subjectId } = useParams();
  const { ownerId } = workspaces.useData() || {};
  const { useSubject, useSubjectStatus } = users;
  const appletLoadingStatus = appletState.useResponseStatus();
  const subjectLoadingStatus = useSubjectStatus();
  const { result: subject } = useSubject() ?? {};
  const { getApplet } = appletState.thunk;
  const respondentTabs = useParticipantDetailsTabs();

  useEffect(() => {
    if (!appletId) return;
    dispatch(getApplet({ appletId }));

    if (!subjectId || !ownerId) return;
    dispatch(getSubjectDetails({ subjectId }));

    return () => {
      dispatch(applets.actions.resetEventsData());
    };
  }, [appletId, subjectId, ownerId]);

  const loading =
    appletLoadingStatus === 'loading' ||
    appletLoadingStatus === 'idle' ||
    subjectLoadingStatus === 'loading' ||
    subjectLoadingStatus === 'idle';

  useEffect(() => {
    if (!loading && !subject) {
      navigate(generatePath(page.appletParticipants, { appletId }));
    }
  }, [loading, subject]);

  return (
    <StyledBody>
      {loading && <Spinner />}
      {!loading && !!subject && (
        <>
          <ParticipantSnippet
            variant={ParticipantSnippetVariant.Large}
            secretId={subject.secretUserId}
            nickname={subject.nickname}
            rightContent={<HeaderOptions exportFilters={{ targetSubjectId: subjectId }} />}
            tag={subject.tag}
            boxProps={{ sx: { mb: 1.2, mx: 2.4 } }}
          />

          <LinkedTabs
            panelProps={{ sx: { p: 0 } }}
            tabs={respondentTabs}
            isCentered={false}
            deepPathCompare
          />
        </>
      )}
    </StyledBody>
  );
};

export default ParticipantDetails;
