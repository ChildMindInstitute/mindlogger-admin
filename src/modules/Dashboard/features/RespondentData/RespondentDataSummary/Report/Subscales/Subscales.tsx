import { useContext, useMemo } from 'react';
import { Box } from '@mui/material';

import { theme } from 'shared/styles';
import { getObjectFromList, calcScores, calcTotalScore } from 'shared/utils';
import { getFinalSubscale } from 'shared/consts';
import { ActivitySettingsSubscale } from 'shared/state';
import { useFeatureFlags } from 'shared/hooks';

import { ActivityCompletionScores } from './ActivityCompletionScores';
import { Subscale } from './Subscale';
import { ReportContext } from '../Report.context';
import {
  ActivityCompletionToRender,
  ParsedSubscale,
  ParsedSubscales,
  SubscalesProps,
} from './Subscales.types';
import { AllScores } from './AllScores';
import {
  getSubscalesToRender,
  groupSubscales,
  getAllSubscalesToRender,
  formatCurrentSubscales,
} from './Subscales.utils';
import { ChartData } from '../Charts/BarChart/BarChart.types';

export const Subscales = ({
  answers,
  versions,
  subscalesFrequency,
  flowResponsesIndex,
}: SubscalesProps) => {
  const { currentActivityCompletionData } = useContext(ReportContext);
  const {
    featureFlags: { enableDataExportRenaming },
  } = useFeatureFlags();
  const finalSubscale = getFinalSubscale(!!enableDataExportRenaming);

  const { finalScores, latestFinalScore, allSubscalesScores, allSubscalesToRender } = useMemo(
    () =>
      answers.reduce(
        (acc: ParsedSubscales, item) => {
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
            calcTotalScore(item.subscaleSetting, activityItems, enableDataExportRenaming)?.[
              finalSubscale.Key
            ];

          if (calculatedTotalScore) {
            acc.latestFinalScore = calculatedTotalScore?.score;
          }

          if (calculatedTotalScore) {
            acc.finalScores.push({
              date: new Date(item.endDatetime),
              score: calculatedTotalScore?.score,
              optionText: calculatedTotalScore?.optionText,
              activityCompletionID: item.answerId,
            });
          }

          for (const subscale of item.subscaleSetting.subscales) {
            getAllSubscalesToRender(acc.allSubscalesToRender, item, subscale, activityItems);

            const calculatedSubscale = calcScores(subscale, activityItems, subscalesObject, {});
            const { [subscale.name]: _removed, ...restScores } = calculatedSubscale;

            const activityCompletion: ParsedSubscale = {
              date: new Date(item.endDatetime),
              score: calculatedSubscale[subscale.name].score,
              optionText: calculatedSubscale[subscale.name].optionText,
              severity: calculatedSubscale[subscale.name].severity,
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
          finalScores: [],
          latestFinalScore: null,
          allSubscalesScores: {},
          allSubscalesToRender: {},
        },
      ),
    [answers, enableDataExportRenaming, finalSubscale],
  );

  const currentActivityCompletion =
    answers.length === 1
      ? answers[0]
      : currentActivityCompletionData &&
        answers.find((item) => item.answerId === currentActivityCompletionData.answerId);

  const calculatedTotalScore =
    currentActivityCompletion?.subscaleSetting?.calculateTotalScore &&
    finalScores?.find((item) => item.activityCompletionID === currentActivityCompletion.answerId);

  const { activityCompletionToRender, activityCompletionScores } =
    currentActivityCompletion?.subscaleSetting?.subscales?.reduce(
      (
        acc: {
          activityCompletionToRender: ActivityCompletionToRender;
          activityCompletionScores: ChartData[];
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
          severity: subscale?.severity,
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
      frequency: subscalesFrequency,
      subscaleScores: [
        ...activityCompletionScores,
        ...(calculatedTotalScore?.score
          ? [
              {
                score: calculatedTotalScore.score,
                label: finalSubscale.FinalSubScaleScore,
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
            id: finalSubscale.FinalSubScaleScore,
            name: finalSubscale.FinalSubScaleScore,
            activityCompletions: finalScores,
          },
        ]
      : []),
  ];

  const allScores = {
    latestFinalScore,
    frequency: subscalesFrequency,
    data: { subscales: lineChartSubscales || [] },
  };

  const subscales = useMemo(() => {
    const currentSubscales = currentActivityCompletion
      ? activityCompletionToRender
      : allSubscalesToRender;

    const formattedSubscales = formatCurrentSubscales(
      currentSubscales as ActivityCompletionToRender,
    );

    return groupSubscales(formattedSubscales, formattedSubscales);
  }, [allSubscalesToRender, activityCompletionToRender, currentActivityCompletion]);

  return (
    <Box sx={{ mb: theme.spacing(6.4) }}>
      {currentActivityCompletionScores ? (
        <ActivityCompletionScores
          {...currentActivityCompletionScores}
          showAllSubscaleResultsVisible={answers?.length > 1}
        />
      ) : (
        <AllScores {...allScores} versions={versions} />
      )}
      <Box sx={{ mt: theme.spacing(6.4) }}>
        {Object.keys(subscales)?.map((name, index) => (
          <Subscale
            data-testid={`subscale-${index}`}
            key={name}
            name={name}
            subscale={subscales[name]}
            versions={versions}
            flowResponsesIndex={flowResponsesIndex}
            isActivityCompletionSelected={!!currentActivityCompletion}
          />
        ))}
      </Box>
    </Box>
  );
};
