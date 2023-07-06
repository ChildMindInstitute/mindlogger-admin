import { useContext, useMemo } from 'react';
import { Box } from '@mui/material';

import { theme } from 'shared/styles';
import { Accordion } from 'modules/Dashboard/components';
import { calcScores, calcTotalScore } from 'shared/utils/exportData/getSubscales';
import { getObjectFromList } from 'shared/utils';
import { FinalSubscale } from 'shared/consts';
import { ActivitySettingsSubscale } from 'shared/state';

import { ActivityCompletionScores } from './ActivityCompletionScores';
import { subscales } from './mock';
import { Subscale } from './Subscale';
import { AdditionalInformation } from './AdditionalInformation';
import { ReportContext } from '../context';
import { ParsedSubscales, SubscalesProps } from './Subscales.types';
import { FREQUENCY } from './Subscales.consts';
import { AllScores } from './AllScores';

export const Subscales = ({ answers }: SubscalesProps) => {
  const { currentActivityCompletionData } = useContext(ReportContext);

  const { finalScores, versions, latestFinalScore, allSubscalesScores } = useMemo(
    () =>
      answers.reduce(
        (acc: ParsedSubscales, item, i) => {
          if (!item?.subscaleSetting?.subscales?.length) return acc;

          const activityItems = getObjectFromList(
            item.decryptedAnswer,
            (item) => item.activityItem.name,
          );

          const subscalesObject = getObjectFromList<ActivitySettingsSubscale>(
            item.subscaleSetting.subscales,
            (item) => item.name,
          );

          const calculatedTotalScore =
            item?.subscaleSetting?.calculateTotalScore &&
            activityItems &&
            calcTotalScore(item.subscaleSetting, activityItems)?.[FinalSubscale.Key];

          if (i === 0 && calculatedTotalScore) {
            acc.latestFinalScore = calculatedTotalScore?.score;
          }

          acc.versions.push({ version: item.version, date: new Date(item.endDatetime) });

          if (calculatedTotalScore) {
            acc.finalScores.push({
              date: new Date(item.endDatetime),
              score: calculatedTotalScore?.score,
              optionText: calculatedTotalScore?.optionText,
              activityCompletionID: item.answerId,
            });
          }

          for (const subscale of item.subscaleSetting.subscales) {
            const calculatedSubscale = calcScores(subscale, activityItems, subscalesObject)[
              subscale.name
            ];
            const activityCompletion = {
              date: new Date(item.endDatetime),
              score: calculatedSubscale.score,
              optionText: calculatedSubscale.optionText,
              activityCompletionID: item.answerId,
            };
            if (acc.allSubscalesScores[subscale.name]) {
              acc.allSubscalesScores[subscale.name].activityCompletions.push(activityCompletion);
            } else {
              acc.allSubscalesScores[subscale.name] = {
                activityCompletions: [activityCompletion],
              };
            }
          }

          return acc;
        },
        { versions: [], finalScores: [], latestFinalScore: null, allSubscalesScores: {} },
      ),
    [answers],
  );

  const currentActivityCompletion =
    currentActivityCompletionData &&
    answers.find((item) => item.answerId === currentActivityCompletionData.answerId);

  const calculatedTotalScore =
    currentActivityCompletion?.subscaleSetting?.calculateTotalScore &&
    finalScores?.find((item) => item.activityCompletionID === currentActivityCompletion.answerId);

  const currentActivityCompletionScores = currentActivityCompletion &&
    currentActivityCompletion?.subscaleSetting?.subscales && {
      reviewDate: currentActivityCompletionData?.date,
      finalSubscaleScore: calculatedTotalScore?.score,
      additionalInformation: {
        description: calculatedTotalScore?.optionText,
      },
      frequency: FREQUENCY,
      subscaleScores: [
        ...currentActivityCompletion.subscaleSetting.subscales.map((item) => {
          const subscale = allSubscalesScores[item.name].activityCompletions.find(
            (el) => el.activityCompletionID === currentActivityCompletion.answerId,
          );

          return {
            label: item.name,
            score: subscale?.score || 0,
          };
        }),
        ...(calculatedTotalScore?.score
          ? [
              {
                score: calculatedTotalScore.score,
                label: FinalSubscale.FinalSubScaleScore,
              },
            ]
          : []),
      ],
    };

  const lineChartSubscales = allSubscalesScores && [
    ...Object.keys(allSubscalesScores).map((key) => ({
      name: key,
      activityCompletions: allSubscalesScores[key].activityCompletions,
    })),
    ...(finalScores?.length
      ? [
          {
            id: FinalSubscale.FinalSubScaleScore,
            name: FinalSubscale.FinalSubScaleScore,
            activityCompletions: finalScores,
          },
        ]
      : []),
  ];

  const allScores = {
    latestFinalScore,
    frequency: answers.length,
    data: { subscales: lineChartSubscales || [], versions },
  };

  return (
    <Box sx={{ mb: theme.spacing(6.4) }}>
      {currentActivityCompletionScores ? (
        <ActivityCompletionScores {...currentActivityCompletionScores} />
      ) : (
        <AllScores {...allScores} />
      )}
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
