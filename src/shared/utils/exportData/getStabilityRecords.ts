import {
  DecryptedStabilityTrackerAnswerObject,
  DecryptedStabilityTrackerCalcValue,
} from 'shared/types';

const getPointStr = (
  pos:
    | DecryptedStabilityTrackerCalcValue['stimPos']
    | DecryptedStabilityTrackerCalcValue['targetPos']
    | DecryptedStabilityTrackerCalcValue['userPos'],
) => {
  if (pos.length === 2) {
    return `(${pos[0]}, ${pos[1]})`;
  }

  return `${pos[0]}`;
};
export const getStabilityRecords = (responses: DecryptedStabilityTrackerAnswerObject['value']) => {
  const result = [];
  let startTime = 0;

  for (let i = 0; i < responses.length; i++) {
    const response = responses[i];

    if (!startTime) {
      startTime = response.timestamp;
    }

    result.push({
      lambda_value: response.lambda,
      lambda_slope: response.lambdaSlope,
      score: response.score,
      stimulus_position: getPointStr(response.stimPos),
      target_position: getPointStr(response.targetPos),
      user_position: getPointStr(response.userPos),
      seconds: Number((response.timestamp - startTime) / 1000).toString(),
      UTC_Timestamp: Number(response.timestamp / 1000).toString(),
      epoch_time_in_seconds_start: !i ? (startTime / 1000).toString() : '',
    });
  }

  return result;
};
