import { getStabilityRecords } from './getStabilityRecords';

const stabilityData = [
  {
    timestamp: 1689145864376,
    stimPos: [0.0013170829577251464],
    targetPos: [0],
    userPos: [0.5568904736342366],
    score: 0.06306843781471252,
    lambda: 0.07563068437814713,
    lambdaSlope: 20,
  },
];
const regularResult = [
  {
    UTC_Timestamp: '1689145864.376',
    epoch_time_in_seconds_start: '1689145864.376',
    lambda_slope: 20,
    lambda_value: 0.07563068437814713,
    score: 0.06306843781471252,
    seconds: '0',
    stimulus_position: '0.0013170829577251464',
    target_position: '0',
    user_position: '0.5568904736342366',
  },
];

const stabilityDataWithStimPosRange = [
  {
    timestamp: 1689145864376,
    stimPos: [0.0013170829577251464, 0.0023170829577251464],
    targetPos: [0],
    userPos: [0.5568904736342366],
    score: 0.06306843781471252,
    lambda: 0.07563068437814713,
    lambdaSlope: 20,
  },
];
const stimPosRangeResult = [
  {
    UTC_Timestamp: '1689145864.376',
    epoch_time_in_seconds_start: '1689145864.376',
    lambda_slope: 20,
    lambda_value: 0.07563068437814713,
    score: 0.06306843781471252,
    seconds: '0',
    stimulus_position: '(0.0013170829577251464, 0.0023170829577251464)',
    target_position: '0',
    user_position: '0.5568904736342366',
  },
];

const stabilityDataWithTargetPosRange = [
  {
    timestamp: 1689145864376,
    stimPos: [0.0013170829577251464],
    targetPos: [0, 0.01],
    userPos: [0.5568904736342366],
    score: 0.06306843781471252,
    lambda: 0.07563068437814713,
    lambdaSlope: 20,
  },
];
const targetPosRangeResult = [
  {
    UTC_Timestamp: '1689145864.376',
    epoch_time_in_seconds_start: '1689145864.376',
    lambda_slope: 20,
    lambda_value: 0.07563068437814713,
    score: 0.06306843781471252,
    seconds: '0',
    stimulus_position: '0.0013170829577251464',
    target_position: '(0, 0.01)',
    user_position: '0.5568904736342366',
  },
];

const stabilityDataWithUserPosRange = [
  {
    timestamp: 1689145864376,
    stimPos: [0.0013170829577251464],
    targetPos: [0],
    userPos: [0.5568904736342366, 0.7568904736342366],
    score: 0.06306843781471252,
    lambda: 0.07563068437814713,
    lambdaSlope: 20,
  },
];
const userPosRangeResult = [
  {
    UTC_Timestamp: '1689145864.376',
    epoch_time_in_seconds_start: '1689145864.376',
    lambda_slope: 20,
    lambda_value: 0.07563068437814713,
    score: 0.06306843781471252,
    seconds: '0',
    stimulus_position: '0.0013170829577251464',
    target_position: '0',
    user_position: '(0.5568904736342366, 0.7568904736342366)',
  },
];

describe('getStabilityRecords', () => {
  test.each`
    answerValue                        | expected                | description
    ${stabilityData}                   | ${regularResult}        | ${'should generate record for row without range points'}
    ${stabilityDataWithStimPosRange}   | ${stimPosRangeResult}   | ${'should generate record for row with stimPos range'}
    ${stabilityDataWithTargetPosRange} | ${targetPosRangeResult} | ${'should generate record for row with targetPos range'}
    ${stabilityDataWithUserPosRange}   | ${userPosRangeResult}   | ${'should generate record for row with userPos range'}
  `('$description', ({ answerValue, expected }) => {
    expect(getStabilityRecords(answerValue)).toEqual(expected);
  });
});
