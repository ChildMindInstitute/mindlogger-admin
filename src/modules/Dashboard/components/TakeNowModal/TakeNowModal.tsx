import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Modal, SubmitBtnVariant } from 'shared/components';
import { auth, workspaces } from 'redux/modules';
import { StyledHeadline } from 'shared/styles';
import { useAsync } from 'shared/hooks';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';
import { getWorkspaceRespondentsApi } from 'api';
import { joinWihComma } from 'shared/utils';

import { TakeNowModalProps } from './TakeNowModal.types';
import {
  StyledTakeNowModalBody,
  StyledTakeNowModalContent,
  StyledTakeNowModalHeader,
} from './TakeNowModal.styles';
import { StyledImageContainer, StyledImg } from '../ActivitySummaryCard/ActivitySummaryCard.styles';
import { LabeledDropdown, Option } from './LabeledDropdown/LabeledDropdown';
import { ParticipantsData } from '../../features/Participants';
import { BaseActivity } from '../ActivityGrid';

export const useTakeNowModal = () => {
  const [activity, setActivity] = useState<BaseActivity | null>(null);
  const [participants, setParticipants] = useState<Option[]>([]);
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
          const value = participant.id ?? participant.details[0].subjectId;
          let labelKey = stringSecretIds;
          if (stringNicknames) {
            labelKey = `${stringSecretIds} (${stringNicknames})`;
          }

          return { value, labelKey };
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
  }, [appletId, ownerId, getParticipants]);

  const TakeNowModal = ({ onClose }: TakeNowModalProps) => {
    const handleClose = () => {
      setActivity(null);
      onClose?.();
    };

    const [selectedParticipant, setSelectedParticipant] = useState<Option | null>(null);
    const [whoIsResponding, setWhoIsResponding] = useState<Option | null>(null);

    const handleSubmit = useCallback(() => {
      console.log('selectedParticipant:', selectedParticipant);
      console.log('whoIsResponding:', whoIsResponding);

      if (selectedParticipant && whoIsResponding) {
        const url = new URL(`protected/applets/${appletId}`, `${process.env.REACT_APP_WEB_URI}/`);
        url.searchParams.set('startActivityOrFlow', activity?.id || '');
        url.searchParams.set('subjectId', selectedParticipant.value);
        url.searchParams.set('respondentId', whoIsResponding.value);

        setActivity(null);
        window.open(url.toString(), '_blank');
      }
    }, [selectedParticipant, whoIsResponding]);

    useEffect(() => {
      if (userData) {
        let whoIsResponding = `${userData.user.id}`;
        if (userData.user.firstName) {
          whoIsResponding += ` (${userData.user.firstName}`;
          if (userData.user.lastName) {
            whoIsResponding += ` ${userData.user.lastName[0].toUpperCase()}.`;
          }
          whoIsResponding += ')';
        }
        setWhoIsResponding({ value: userData.user.id, labelKey: whoIsResponding });
      }
    }, []);

    if (!activity || !participants || !whoIsResponding) {
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
        disabledSubmit={selectedParticipant === null}
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
              name={'participant'}
              tooltip="This is the subject of the activity being assigned."
              placeholder="Select from participants"
              value={selectedParticipant}
              options={participants}
              onChange={(option) => {
                console.log('Selected participant:', option);
                setSelectedParticipant(option);
              }}
            />
            <LabeledDropdown
              label="Who is responding?"
              name={'respondent'}
              tooltip="This is the participant who will be completing the activity."
              placeholder="Select from participants & team members"
              options={[whoIsResponding]}
              value={whoIsResponding}
              onChange={(option) => {
                console.log('Selected respondent:', option);
                setWhoIsResponding(option);
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
