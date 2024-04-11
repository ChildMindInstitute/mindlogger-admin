import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Modal, SubmitBtnVariant } from 'shared/components';
import { auth, workspaces } from 'redux/modules';
import { StyledHeadline } from 'shared/styles';
import { useAsync } from 'shared/hooks';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';
import { getWorkspaceRespondentsApi } from 'api';
import { joinWihComma } from 'shared/utils';
import { AutocompleteOption } from 'shared/components/FormComponents';

import { TakeNowModalProps } from './TakeNowModal.types';
import {
  StyledTakeNowModalBody,
  StyledTakeNowModalContent,
  StyledTakeNowModalHeader,
} from './TakeNowModal.styles';
import { StyledImageContainer, StyledImg } from '../ActivitySummaryCard/ActivitySummaryCard.styles';
import { LabeledDropdown } from './LabeledDropdown/LabeledDropdown';
import { ParticipantsData } from '../../features/Participants';
import { BaseActivity } from '../ActivityGrid';

export const useTakeNowModal = () => {
  const [activity, setActivity] = useState<BaseActivity | null>(null);
  const [participants, setParticipants] = useState<AutocompleteOption[]>([]);
  const [participantsAndTeamMembers, setParticipantsAndTeamMembers] = useState<
    AutocompleteOption[]
  >([]);
  const { ownerId } = workspaces.useData() || {};
  const userData = auth.useData();
  const { appletId } = useParams();

  const { execute: getParticipants } = useAsync(getWorkspaceRespondentsApi, (response) => {
    if (response?.data) {
      const data = (response.data as ParticipantsData).result;
      console.log('Participants:');
      console.log(data);
      setParticipants(
        data.map((participant) => {
          const stringNicknames = joinWihComma(participant.nicknames, true);
          const stringSecretIds = joinWihComma(participant.secretIds, true);
          const id = participant.id ?? participant.details[0].subjectId;
          let label = stringSecretIds;
          if (stringNicknames) {
            label = `${stringSecretIds} (${stringNicknames})`;
          }

          return { id, label };
        }),
      );
    }
  });

  useEffect(() => {
    if (appletId) {
      console.log('Executing getParticipants');
      getParticipants({
        params: {
          ownerId,
          appletId,
          limit: DEFAULT_ROWS_PER_PAGE,
        },
      });
    }

    if (userData) {
      // For now, the admin is the only member of this list
      let whoIsResponding = `${userData.user.id}`;
      if (userData.user.firstName) {
        whoIsResponding += ` (${userData.user.firstName}`;
        if (userData.user.lastName) {
          whoIsResponding += ` ${userData.user.lastName[0].toUpperCase()}.`;
        }
        whoIsResponding += ')';
      }

      const ownerOption = { id: userData.user.id, label: whoIsResponding };

      // In the future we will allow choosing from the full list of participants and team members
      setParticipantsAndTeamMembers([ownerOption]);
    }
  }, [appletId, ownerId, getParticipants, userData]);

  const TakeNowModal = ({ onClose }: TakeNowModalProps) => {
    const handleClose = () => {
      setActivity(null);
      onClose?.();
    };

    const [subject, setSubject] = useState<AutocompleteOption | null>(null);
    const [participant, setParticipant] = useState<AutocompleteOption | null>(
      participantsAndTeamMembers[0],
    );
    const handleSubmit = useCallback(() => {
      console.log('selectedParticipant:', subject);
      console.log('whoIsResponding:', participant);

      if (subject && participant && activity?.id) {
        const url = new URL(`protected/applets/${appletId}`, `${process.env.REACT_APP_WEB_URI}/`);
        url.searchParams.set('startActivityOrFlow', activity.id);
        url.searchParams.set('subjectId', subject.id);
        url.searchParams.set('respondentId', participant.id);

        setActivity(null);
        window.open(url.toString(), '_blank');
      }
    }, [subject, participant]);

    if (!activity || !participants || !participantsAndTeamMembers) {
      return null;
    }

    return (
      <Modal
        open={true}
        width="57"
        title="Take Now"
        buttonText="Start Activity"
        onSubmit={handleSubmit}
        onClose={handleClose}
        disabledSubmit={subject === null || participant === null}
        submitBtnVariant={SubmitBtnVariant.Contained}
        footerStyles={{ padding: '0.8rem 3.2rem 3.2rem' }}
      >
        <StyledTakeNowModalContent>
          <StyledTakeNowModalHeader>
            <StyledImageContainer>
              {!!activity.image && <StyledImg src={activity.image} alt={activity.name} />}
            </StyledImageContainer>
            <StyledHeadline sx={{ flexGrow: 1 }}>{activity.name}</StyledHeadline>
          </StyledTakeNowModalHeader>
          <StyledTakeNowModalBody>
            <LabeledDropdown
              label="Who is this activity about?"
              name={'subject'}
              tooltip="This is the subject of the activity being assigned."
              placeholder="Select from participants"
              value={subject}
              options={participants}
              onChange={(option) => {
                console.log('Selected subject:', option);
                setSubject(option);
              }}
            />
            <LabeledDropdown
              label="Who is responding?"
              name={'respondent'}
              tooltip="This is the participant who will be completing the activity."
              placeholder="Select from participants & team members"
              value={participant}
              options={participantsAndTeamMembers}
              onChange={(option) => {
                console.log('Selected participant:', option);
                setParticipant(option);
              }}
            />
          </StyledTakeNowModalBody>
        </StyledTakeNowModalContent>
      </Modal>
    );
  };

  const openTakeNowModal = (activity: BaseActivity) => {
    setActivity(activity);
  };

  return { TakeNowModal, openTakeNowModal };
};
