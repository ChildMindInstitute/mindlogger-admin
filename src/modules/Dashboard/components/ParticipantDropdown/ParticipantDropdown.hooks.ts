import { useCallback, useEffect, useMemo, useState } from 'react';

import { DEFAULT_ROWS_PER_PAGE, Roles, TEAM_MEMBER_ROLES } from 'shared/consts';
import { ParticipantsData } from 'modules/Dashboard/features/Participants';
import { getWorkspaceRespondentsApi } from 'api';
import { useAsync } from 'shared/hooks';
import { Participant, ParticipantStatus } from 'modules/Dashboard/types';
import { auth, workspaces } from 'redux/modules';

import {
  ParticipantDropdownOption,
  UseParticipantDropdownProps,
  SearchResultUserTypes,
} from './ParticipantDropdown.types';
import { participantToOption } from './ParticipantDropdown.utils';

const ALLOWED_TEAM_MEMBER_ROLES: readonly Roles[] = [
  Roles.SuperAdmin,
  Roles.Owner,
  Roles.Manager,
] as const;

export const useParticipantDropdown = ({
  appletId,
  includePendingAccounts = false,
  skip = false,
  successCallback,
  errorCallback,
  finallyCallback,
}: UseParticipantDropdownProps) => {
  const [allParticipants, setAllParticipants] = useState<ParticipantDropdownOption[]>([]);
  const [loggedInTeamMember, setLoggedInTeamMember] = useState<ParticipantDropdownOption | null>(
    null,
  );
  const { ownerId } = workspaces.useData() || {};
  const userData = auth.useData();

  const isParticipantValid = useCallback(
    (r: Participant) =>
      !r.isAnonymousRespondent &&
      (includePendingAccounts || r.status !== ParticipantStatus.Pending),
    [includePendingAccounts],
  );

  const { execute: fetchParticipants, isLoading: isFetchingParticipants } = useAsync(
    getWorkspaceRespondentsApi,
    (response) => {
      if (response?.data) {
        const options = (response.data as ParticipantsData).result
          .filter(isParticipantValid)
          .map(participantToOption);

        setAllParticipants(options);
      }
      successCallback?.(response);
    },
    errorCallback,
    finallyCallback,
  );

  const {
    execute: fetchLoggedInTeamMember,
    isLoading: isFetchingLoggedInTeamMember,
    value: loggedInTeamMemberResponse,
  } = useAsync(
    getWorkspaceRespondentsApi,
    (response) => {
      if (response?.data) {
        const loggedInTeamMember = participantToOption(
          (response.data as ParticipantsData).result[0],
        );
        setLoggedInTeamMember(loggedInTeamMember);
        setAllParticipants((prev) => {
          if (prev.some((participant) => participant.id === loggedInTeamMember.id)) {
            return prev;
          }

          return [loggedInTeamMember, ...prev];
        });
      }
      successCallback?.(response);
    },
    errorCallback,
    finallyCallback,
  );

  const isTeamMember = useCallback(
    (roles: Roles[]): boolean => roles.some((role) => TEAM_MEMBER_ROLES.includes(role)),
    [],
  );

  const isAllowedTeamMember = useCallback(
    (roles: Roles[]): boolean => roles.some((role) => ALLOWED_TEAM_MEMBER_ROLES.includes(role)),
    [],
  );

  const participantsOnly = useMemo(
    () => allParticipants.filter(({ isTeamMember }) => !isTeamMember),
    [allParticipants],
  );

  const teamMembersOnly = useMemo(
    () => allParticipants.filter((participant) => isAllowedTeamMember(participant.roles)),
    [allParticipants, isAllowedTeamMember],
  );

  const participantsAndTeamMembers = useMemo(
    () => [...teamMembersOnly, ...participantsOnly],
    [participantsOnly, teamMembersOnly],
  );

  const fullAccountParticipantsOnly = useMemo(
    () => participantsOnly.filter((participant) => !!participant.userId),
    [participantsOnly],
  );

  const fullAccountParticipantsAndTeamMembers = useMemo(
    () => [...teamMembersOnly, ...fullAccountParticipantsOnly],
    [fullAccountParticipantsOnly, teamMembersOnly],
  );

  /**
   * Handle participant search. It can be a combination of team members and any participants
   * (full and limited accounts), or just team members and full account participants
   */
  const handleSearch = useCallback(
    async (
      query: string,
      includedUserTypes: SearchResultUserTypes,
    ): Promise<ParticipantDropdownOption[]> => {
      const response = await getWorkspaceRespondentsApi({
        params: {
          ownerId,
          appletId,
          search: query,
          limit: DEFAULT_ROWS_PER_PAGE,
          shell: includedUserTypes.limitedParticipant,
        },
      });

      const participantsSearchResults = ((response?.data.result as Participant[]) ?? []).filter(
        (participant) => {
          if (participant.isAnonymousRespondent) return includedUserTypes.anonymousParticipant;

          if (participant.status === ParticipantStatus.Pending) {
            return includePendingAccounts && includedUserTypes.pendingInvitedParticipant;
          }

          const participantAppletDetails = participant.details[0];

          if (isTeamMember(participantAppletDetails.roles)) {
            return includedUserTypes.team && isAllowedTeamMember(participantAppletDetails.roles);
          }

          if (participantAppletDetails.roles.length === 0) {
            return includedUserTypes.limitedParticipant;
          }

          return includedUserTypes.fullParticipant;
        },
      );

      return participantsSearchResults.map(participantToOption);
    },
    [ownerId, appletId, isTeamMember, includePendingAccounts, isAllowedTeamMember],
  );

  useEffect(() => {
    if (skip || !appletId) return;

    if (allParticipants.length === 0 && !isFetchingParticipants) {
      fetchParticipants({
        params: {
          ownerId,
          appletId,
          limit: 100,
        },
      });
    }

    if (userData && loggedInTeamMemberResponse === null && !isFetchingLoggedInTeamMember) {
      fetchLoggedInTeamMember({
        params: {
          ownerId,
          appletId,
          userId: userData.user.id,
          limit: 1,
        },
      });
    }
  }, [
    appletId,
    ownerId,
    userData,
    allParticipants,
    loggedInTeamMemberResponse,
    isFetchingParticipants,
    isFetchingLoggedInTeamMember,
    fetchParticipants,
    fetchLoggedInTeamMember,
    skip,
  ]);

  const isLoading = isFetchingParticipants || isFetchingLoggedInTeamMember;

  return {
    allParticipants,
    participantsOnly,
    teamMembersOnly,
    participantsAndTeamMembers,
    fullAccountParticipantsOnly,
    fullAccountParticipantsAndTeamMembers,
    loggedInTeamMember,
    handleSearch,
    isLoading,
  };
};
