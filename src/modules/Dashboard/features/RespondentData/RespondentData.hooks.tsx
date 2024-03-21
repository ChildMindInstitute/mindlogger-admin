import { useMemo } from 'react';
import { generatePath, useParams } from 'react-router-dom';
import { addDays, isAfter, isBefore } from 'date-fns';
import { useFormContext, UseFormWatch } from 'react-hook-form';

import { Svg } from 'shared/components/Svg';
import { page } from 'resources';
import {
  getAnswersApi,
  getIdentifiersApi,
  getVersionsApi,
  Identifier as IdentifierResponse,
  Version,
} from 'api';
import { decryptData, getAESKey, getDateTime, getParsedEncryptionFromServer } from 'shared/utils';
import { useEncryptionStorage } from 'shared/hooks';
import { applet } from 'shared/state';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';

import {
  getDateISO,
  getFormattedResponses,
  getIdentifiers,
} from './RespondentDataSummary/Report/Report.utils';
import { getUniqueIdentifierOptions } from './RespondentData.utils';
import {
  RespondentsDataFormValues,
  Identifier,
  GetIdentifiersVersions,
  FetchAnswers,
} from './RespondentData.types';

export const useRespondentDataTabs = () => {
  const { appletId, respondentId } = useParams();

  return [
    {
      labelKey: 'summary',
      id: 'respondent-data-summary',
      icon: <Svg id="chart" />,
      activeIcon: <Svg id="chart" />,
      path: generatePath(page.appletRespondentDataSummary, {
        appletId,
        respondentId,
      }),
      'data-testid': 'respondents-summary-tab-summary',
    },
    {
      labelKey: 'responses',
      id: 'respondent-data-responses',
      icon: <Svg id="checkbox-outlined" />,
      activeIcon: <Svg id="checkbox-filled" />,
      path: generatePath(page.appletRespondentDataReview, {
        appletId,
        respondentId,
      }),
      'data-testid': 'respondents-summary-tab-review',
    },
  ];
};

export const useDatavizSummaryRequests = () => {
  const { appletId, respondentId } = useParams();
  const getDecryptedIdentifiers = useDecryptedIdentifiers();
  const { setValue } = useFormContext<RespondentsDataFormValues>();

  const getIdentifiersVersions = async ({ activity }: GetIdentifiersVersions) => {
    try {
      if (!appletId || !respondentId || !activity?.hasAnswer || activity?.isPerformanceTask) return;

      const identifiers = await getIdentifiersApi({
        appletId,
        activityId: activity.id,
        respondentId,
      });
      if (!getDecryptedIdentifiers) return;
      const decryptedIdentifiers = await getDecryptedIdentifiers(identifiers.data.result);
      const identifiersFilter = getUniqueIdentifierOptions(decryptedIdentifiers);
      setValue('identifier', identifiersFilter);
      setValue('identifiers', decryptedIdentifiers);

      const versions = await getVersionsApi({ appletId, activityId: activity.id });
      const versionsFilter = versions.data.result?.map(({ version }) => ({
        id: version,
        label: version,
      }));
      setValue('versions', versionsFilter);
      setValue('apiVersions', versions.data.result);
    } catch (error) {
      console.warn(error);
    }
  };

  return { getIdentifiersVersions };
};

export const useDatavizFilters = (
  watch: UseFormWatch<RespondentsDataFormValues>,
  versions: Version[],
) => {
  const { startDate, endDate, startTime, endTime } = watch();

  const { minDate, maxDate, filteredVersions } = useMemo(() => {
    const minDate = getDateTime(startDate, startTime);
    const maxDate = getDateTime(endDate, endTime);
    const filteredVersions = versions.filter(
      (version) =>
        isBefore(new Date(version.createdAt), maxDate) &&
        isAfter(new Date(version.createdAt), minDate),
    );

    return { minDate, maxDate, filteredVersions };
  }, [startDate, endDate, startTime, endTime, versions]);

  return { minDate, maxDate, filteredVersions };
};

export const useDecryptedIdentifiers = () => {
  const { appletId = '' } = useParams();
  const { result: appletData } = applet.useAppletData() ?? {};
  const encryption = appletData?.encryption;
  const encryptionInfoFromServer = encryption ? getParsedEncryptionFromServer(encryption) : null;
  const { getAppletPrivateKey } = useEncryptionStorage();

  if (!encryptionInfoFromServer) return null;

  const { prime, base } = encryptionInfoFromServer;
  const privateKey = getAppletPrivateKey(appletId);

  return async (identifiers: IdentifierResponse[]): Promise<Identifier[]> => {
    const identifiersResult: Identifier[] = [];

    for await (const identifierResponse of identifiers) {
      const { identifier, userPublicKey } = identifierResponse;

      // workaround for decrypted identifier data
      if (!userPublicKey) {
        identifiersResult.push({
          decryptedValue: identifier,
          encryptedValue: identifier,
        });
        continue;
      }

      try {
        const key = await getAESKey(privateKey, JSON.parse(userPublicKey), prime, base);
        const decryptedValue = await decryptData({
          text: identifier,
          key,
        });

        identifiersResult.push({
          decryptedValue,
          encryptedValue: identifier,
        });
      } catch {
        console.warn('Error while answer parsing');
        continue;
      }
    }

    return identifiersResult;
  };
};

export const useRespondentAnswers = () => {
  const { appletId, respondentId } = useParams();
  const getDecryptedActivityData = useDecryptedActivityData();
  const { getValues, setValue } = useFormContext<RespondentsDataFormValues>();

  const fetchAnswers = async ({
    activity,
    endDate: providedEndDate,
    startTime: providedStartTime,
    endTime: providedEndTime,
    filterByIdentifier: providedFilterByIdentifier,
    versions: providedVersions,
  }: FetchAnswers) => {
    if (!appletId || !respondentId) return;
    try {
      const {
        startDate,
        endDate: formEndDate,
        startTime: formStartTime,
        endTime: formEndTime,
        identifier,
        filterByIdentifier: formFilterByIdentifier,
        versions: formVersions,
        identifiers,
      } = getValues();
      const endDate = providedEndDate ?? formEndDate;
      const startTime = providedStartTime ?? formStartTime;
      const endTime = providedEndTime ?? formEndTime;
      const filterByIdentifier = providedFilterByIdentifier ?? formFilterByIdentifier;
      const versions = providedVersions ?? formVersions;

      const selectedIdentifiers = getIdentifiers(filterByIdentifier, identifier, identifiers);

      const result = await getAnswersApi({
        appletId,
        activityId: activity.id,
        params: {
          respondentId,
          fromDatetime: getDateISO(startDate, startTime),
          toDatetime: getDateISO(endDate || addDays(startDate, 1), endTime),
          emptyIdentifiers: !filterByIdentifier || !selectedIdentifiers?.length,
          identifiers: selectedIdentifiers,
          versions: versions.map(({ id }) => id),
        },
      });

      const encryptedAnswers = result.data.result;
      const decryptedAnswers = [];

      for await (const encryptedAnswer of encryptedAnswers) {
        const { userPublicKey, answer, items, itemIds, ...rest } = encryptedAnswer;
        const decryptedAnswer = (
          await getDecryptedActivityData({
            userPublicKey,
            answer,
            items,
            itemIds,
          })
        ).decryptedAnswers;

        decryptedAnswers.push({
          decryptedAnswer,
          ...rest,
        });
      }

      // TODO: remove when backend add sorting
      const sortedDecryptedAnswers = decryptedAnswers.sort((a, b) =>
        a.version.localeCompare(b.version),
      );

      setValue('answers', sortedDecryptedAnswers);
      const { subscalesFrequency, formattedResponses } =
        getFormattedResponses(sortedDecryptedAnswers);

      setValue('responseOptions', formattedResponses);
      setValue('subscalesFrequency', subscalesFrequency);
    } catch (error) {
      console.warn(error);
    }
  };

  return {
    fetchAnswers,
  };
};
