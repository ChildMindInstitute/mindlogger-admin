import { useContext, useMemo } from 'react';
import { Box } from '@mui/material';

import { theme } from 'shared/styles';
import { Accordion } from 'modules/Dashboard/components';
import { getObjectFromList, calcScores, calcTotalScore } from 'shared/utils';
import { FinalSubscale } from 'shared/consts';
import { ActivitySettingsSubscale } from 'shared/state';

import { ActivityCompletionScores } from './ActivityCompletionScores';
import { subscales } from './mock';
import { Subscale } from './Subscale';
import { AdditionalInformation } from './AdditionalInformation';
import { ReportContext } from '../context';
import {
  ActivityCompletionToRender,
  ParsedSubscales,
  SubscaleScore,
  SubscalesProps,
} from './Subscales.types';
import { FREQUENCY } from './Subscales.consts';
import { AllScores } from './AllScores';
import { getSubscalesToRender } from './Subscales.utils';

export const Subscales = ({ answers }: SubscalesProps) => {
  const { currentActivityCompletionData } = useContext(ReportContext);

  const { finalScores, versions, latestFinalScore, allSubscalesScores, allSubscalesToRender } =
    useMemo(
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

            acc.versions.push({ version: item.version, createdAt: item.endDatetime });

            if (calculatedTotalScore) {
              acc.finalScores.push({
                date: new Date(item.endDatetime),
                score: calculatedTotalScore?.score,
                optionText: calculatedTotalScore?.optionText,
                activityCompletionID: item.answerId,
              });
            }

            for (const subscale of item.subscaleSetting.subscales) {
              getSubscalesToRender(
                subscale,
                activityItems,
                subscalesObject,
                item.endDatetime,
                acc.allSubscalesToRender,
              );

              const calculatedSubscale = calcScores(subscale, activityItems, subscalesObject, {});
              const { [subscale.name]: removed, ...restScores } = calculatedSubscale;

              const activityCompletion = {
                date: new Date(item.endDatetime),
                score: calculatedSubscale[subscale.name].score,
                optionText: calculatedSubscale[subscale.name].optionText,
                activityCompletionID: item.answerId,
                activityItems,
                subscalesObject,
                restScores,
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
          {
            versions: [],
            finalScores: [],
            latestFinalScore: null,
            allSubscalesScores: {},
            allSubscalesToRender: {},
          },
        ),
      [answers],
    );

  const currentActivityCompletion =
    currentActivityCompletionData &&
    answers.find((item) => item.answerId === currentActivityCompletionData.answerId);

  const calculatedTotalScore =
    currentActivityCompletion?.subscaleSetting?.calculateTotalScore &&
    finalScores?.find((item) => item.activityCompletionID === currentActivityCompletion.answerId);

  const { activityCompletionToRender, activityCompletionScores } =
    currentActivityCompletion?.subscaleSetting?.subscales?.reduce(
      (
        acc: {
          activityCompletionToRender: ActivityCompletionToRender;
          activityCompletionScores: SubscaleScore[];
        },
        item,
      ) => {
        const subscale = allSubscalesScores[item.name].activityCompletions.find(
          (el) => el.activityCompletionID === currentActivityCompletion.answerId,
        );

        if (!subscale) return acc;

        const subscaleToRender = getSubscalesToRender(
          item,
          subscale.activityItems,
          subscale.subscalesObject,
          currentActivityCompletion.endDatetime,
          {},
        );
        acc.activityCompletionToRender[item.name] = {
          ...subscaleToRender[item.name],
          score: subscale?.score,
          optionText: subscale?.optionText,
          restScores: subscale.restScores,
        };
        acc.activityCompletionScores.push({
          label: item.name,
          score: subscale?.score || 0,
        });

        return acc;
      },
      { activityCompletionToRender: {}, activityCompletionScores: [] },
    ) || { activityCompletionToRender: {}, activityCompletionScores: [] };

  const currentActivityCompletionScores = currentActivityCompletion &&
    currentActivityCompletion?.subscaleSetting?.subscales && {
      reviewDate: currentActivityCompletionData?.date,
      finalSubscaleScore: calculatedTotalScore?.score,
      additionalInformation: {
        description: calculatedTotalScore?.optionText,
      },
      frequency: FREQUENCY,
      subscaleScores: [
        ...activityCompletionScores,
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
