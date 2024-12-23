import { useCallback, useEffect, useMemo, useState } from 'react';

import { DEFAULT_ROWS_PER_PAGE, Roles } from 'shared/consts';
import { ParticipantsData } from 'modules/Dashboard/features/Participants';
import { getWorkspaceManagersApi, getWorkspaceRespondentsApi } from 'api';
import { useAsync } from 'shared/hooks';
import { Manager, Participant, ParticipantStatus } from 'modules/Dashboard/types';
import { auth, workspaces } from 'redux/modules';

import {
  ParticipantDropdownOption,
  UseParticipantDropdownProps,
  AnyTeamSearchType,
  FullTeamSearchType,
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
  const [allTeamMembers, setAllTeamMembers] = useState<Manager[]>([]);
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

  const { execute: fetchManagers, isLoading: isFetchingManagers } = useAsync(
    getWorkspaceManagersApi,
    (response) => {
      setAllTeamMembers(response?.data?.result || []);
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

  const allowedTeamMembers = useMemo(
    () =>
      allTeamMembers.filter((manager) =>
        manager.roles.some((role) => ALLOWED_TEAM_MEMBER_ROLES.includes(role)),
      ),
    [allTeamMembers],
  );

  const participantsOnly = useMemo(
    () => allParticipants.filter(({ isTeamMember }) => !isTeamMember),
    [allParticipants],
  );

  const teamMembersOnly = useMemo(
    () =>
      allParticipants.filter(
        (participant) =>
          participant.isTeamMember &&
          allowedTeamMembers.some((manager) => manager.id === participant.userId),
      ),
    [allParticipants, allowedTeamMembers],
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
      types:
        | [AnyTeamSearchType, ...AnyTeamSearchType[]]
        | [FullTeamSearchType, ...FullTeamSearchType[]],
    ): Promise<ParticipantDropdownOption[]> => {
      const requests = [];

      // @ts-expect-error Yes, the array can in fact contain this value
      const isAnyParticipant = types.includes('any-participant');

      // @ts-expect-error Yes, the array can in fact contain this value
      const isFullParticipant = types.includes('full-participant');

      if (types.includes('team')) {
        requests.push(
          getWorkspaceManagersApi({
            params: {
              ownerId,
              appletId,
              search: query,
              limit: DEFAULT_ROWS_PER_PAGE,
            },
          }),
        );
      }

      if (isAnyParticipant) {
        requests.push(
          getWorkspaceRespondentsApi({
            params: {
              ownerId,
              appletId,
              search: query,
              limit: DEFAULT_ROWS_PER_PAGE,
            },
          }),
        );
      } else if (isFullParticipant) {
        requests.push(
          getWorkspaceRespondentsApi({
            params: {
              ownerId,
              appletId,
              search: query,
              limit: DEFAULT_ROWS_PER_PAGE,
              shell: isFullParticipant ? false : undefined,
            },
          }),
        );
      }

      const responses = await Promise.all(requests);

      const participantsResponse =
        isAnyParticipant || isFullParticipant ? responses.pop() : undefined;
      const teamMemberResponse = types.includes('team') ? responses.pop() : undefined;

      // Filter the search results by allowed team members
      const allowedTeamMembersSearchResults = (
        (teamMemberResponse?.data.result as Manager[]) ?? []
      ).filter((manager) => manager.roles.some((role) => ALLOWED_TEAM_MEMBER_ROLES.includes(role)));

      const participantsSearchResults = (
        (participantsResponse?.data.result as Participant[]) ?? []
      ).filter((participant) => {
        if (!isParticipantValid(participant)) return false;

        // If there are team members in the search results, we only want to show them if they are
        // allowed
        if (!participant.id || participant.details[0].subjectTag !== 'Team') {
          return isAnyParticipant || !!participant.id;
        } else {
          return allowedTeamMembersSearchResults.some((manager) => manager.id === participant.id);
        }
      });

      return participantsSearchResults.map(participantToOption);
    },
    [ownerId, appletId, isParticipantValid],
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
    } else if (allParticipants.length > 0 && allTeamMembers.length === 0 && !isFetchingManagers) {
      fetchManagers({
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
    allTeamMembers,
    loggedInTeamMemberResponse,
    isFetchingParticipants,
    isFetchingManagers,
    isFetchingLoggedInTeamMember,
    fetchParticipants,
    fetchManagers,
    fetchLoggedInTeamMember,
    skip,
  ]);

  const isLoading = isFetchingParticipants || isFetchingManagers || isFetchingLoggedInTeamMember;

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
