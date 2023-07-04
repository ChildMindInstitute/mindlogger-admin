import { useContext, useMemo } from 'react';
import { Box } from '@mui/material';

import { theme } from 'shared/styles';
import { Accordion } from 'modules/Dashboard/components';
import { calcScores, calcTotalScore } from 'shared/utils/exportData/getSubscales';
import { getObjectFromList } from 'shared/utils';
import { FinalSubscale } from 'shared/consts';
import { ActivitySettingsSubscale } from 'shared/state';

import { Scores } from './Scores';
import { subscales } from './mock';
import { Subscale } from './Subscale';
import { AdditionalInformation } from './AdditionalInformation';
import { ReportContext } from '../context';
import { ParsedSubscales, SubscaleScore, SubscalesProps } from './Subscales.types';
import { FREQUENCY } from './Subscales.consts';

export const Subscales = ({ answers }: SubscalesProps) => {
  const { currentActivityCompletionData } = useContext(ReportContext);

  const allSubscalesScores = useMemo(
    () =>
      answers.reduce((allSubscales: { [key: string]: ParsedSubscales }, item) => {
        if (!item?.subscaleSetting?.subscales?.length) return allSubscales;

        const activityItems = getObjectFromList(
          item.decryptedAnswer,
          (item) => item.activityItem.name,
        );

        const subscalesObject = getObjectFromList<ActivitySettingsSubscale>(
          item.subscaleSetting.subscales,
          (item) => item.name,
        );

        const calculatedTotalScore = calcTotalScore(item.subscaleSetting, activityItems);

        const parsedSubscales = item.subscaleSetting.subscales.reduce(
          (acc: ParsedSubscales, item) => {
            const calculatedSubscale = calcScores(item, activityItems, subscalesObject);

            acc.subscales = calculatedSubscale;
            if (calculatedTotalScore) {
              acc.totalScore = { ...calculatedTotalScore[FinalSubscale.Key] };
            }

            return acc;
          },
          { subscales: {}, totalScore: {} },
        );

        allSubscales[item.answerId] = parsedSubscales;

        return allSubscales;
      }, {}),
    [answers],
  );

  const currentActivityCompletion = answers.find(
    (item) => item.answerId === currentActivityCompletionData?.answerId,
  );

  const currentActivityCompletionSubs =
    allSubscalesScores &&
    currentActivityCompletionData &&
    allSubscalesScores[currentActivityCompletionData?.answerId];

  const currentActivityCompletionScores = currentActivityCompletionSubs &&
    currentActivityCompletion?.subscaleSetting?.subscales && {
      reviewDate: currentActivityCompletionData?.date,
      finalSubscaleScore: currentActivityCompletionSubs.totalScore?.score,
      additionalInformation: {
        description: currentActivityCompletionSubs.totalScore?.optionText,
      },
      frequency: FREQUENCY,
      subscaleScores: [
        ...currentActivityCompletion.subscaleSetting.subscales.reduce(
          (acc: SubscaleScore[], item) => {
            if (currentActivityCompletionSubs.subscales[item.name]) {
              acc.push({
                score: currentActivityCompletionSubs.subscales[item.name].score,
                label: item.name,
              });
            }

            return acc;
          },
          [],
        ),
        ...(currentActivityCompletionSubs.totalScore?.score
          ? [
              {
                score: currentActivityCompletionSubs.totalScore.score,
                label: FinalSubscale.FinalSubScaleScore,
              },
            ]
          : []),
      ],
    };

  return (
    <Box sx={{ mb: theme.spacing(6.4) }}>
      {currentActivityCompletionScores && <Scores {...currentActivityCompletionScores} />}
      {subscales?.map(({ name, id, items, additionalInformation }) => (
        <Accordion title={name} key={id}>
          <>
            {additionalInformation && (
              <Box sx={{ m: theme.spacing(4.8, 0) }}>
                <AdditionalInformation {...additionalInformation} />
              </Box>
            )}
            <Subscale items={items} />
          </>
        </Accordion>
      ))}
    </Box>
  );
};
