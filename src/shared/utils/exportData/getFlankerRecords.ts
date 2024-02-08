import { FlankerConfig, FlankerItem } from 'shared/state';
import {
  DecryptedFlankerAnswerItemValue,
  DotType,
  FlankerRecordFields,
  FlankerResponseAccuracy,
  FlankerResponseValue,
  FlankerTag,
  NumberWithDotType,
} from 'shared/types';
import { CorrectPress } from 'modules/Builder/types';

const getImage = (image: string, alt: string) => {
  if (image) {
    return `<img src="${image}" alt="${alt}">`;
  }

  return alt;
};

const getTypes = (trials: FlankerConfig['stimulusTrials']) =>
  trials.reduce(
    (prev, trial) => ({
      ...prev,
      [getImage(trial.image, trial.text)]: trial.text,
      [trial.image]: trial.text,
    }),
    {} as Record<string, string>,
  );

const getEventType = (tag: FlankerTag) => {
  switch (tag) {
    case FlankerTag.Response:
      return 'Response';
    case FlankerTag.Trial:
      return 'Stimulus';
    case FlankerTag.Fixation:
      return 'Fixation';
    case FlankerTag.Feedback:
      return 'Feedback';
  }
};

const getTrialType = ({
  tag,
  types,
  response,
}: {
  tag: FlankerTag;
  types: ReturnType<typeof getTypes>;
  response: DecryptedFlankerAnswerItemValue;
}) => {
  if (tag === FlankerTag.Trial || tag === FlankerTag.Response) {
    return types[response.question] || response.question;
  }

  return tag === FlankerTag.Feedback ? 0 : -1;
};

/* Item's indexes in flanker activity:
  0 vsr-instructions
  1 practice-instructions
  2 trial
  3 trial2-instructions
  4 trial2
  5 trial3-instructions
  6 trial3
  7 test-instructions
  8 test1
  9 test2-instructions
  10 test2
  11 test3-instructions
  12 test3
*/
const getBlockNumber = (itemIndex: number) => {
  switch (itemIndex) {
    case 8: // test1
      return 1;
    case 10: // test2
      return 2;
    case 12: // test3
      return 3;
    default:
      return 0;
  }
};

const getResponseObj = ({
  response,
  tag,
  itemIndex,
  trialStartTimestamp,
  types,
}: {
  response: DecryptedFlankerAnswerItemValue;
  tag: FlankerTag;
  itemIndex: number;
  trialStartTimestamp: number;
  types: ReturnType<typeof getTypes>;
}) => {
  const trialNumber = response.trial_index;
  const blockNumber = getBlockNumber(itemIndex);
  const trialType = getTrialType({
    tag,
    types,
    response,
  });
  const eventType = getEventType(tag);

  let responseValue: DotType | FlankerResponseValue = DEFAULT_VALUE;
  let responseAccuracy: DotType | FlankerResponseAccuracy = DEFAULT_VALUE;
  let responseTouchTimestamp: NumberWithDotType = DEFAULT_VALUE;
  let responseTime: NumberWithDotType = DEFAULT_VALUE;
  let videoDisplayRequestTimestamp: NumberWithDotType = response.start_time + response.offset;
  let eventStartTimestamp: NumberWithDotType = response.start_timestamp;
  let eventOffset: NumberWithDotType = eventStartTimestamp - trialStartTimestamp;

  if (tag === FlankerTag.Response) {
    eventOffset = eventStartTimestamp = DEFAULT_VALUE;
    const buttonPressed =
      Number(response.button_pressed) === CorrectPress.Left ? FlankerResponseValue.Left : FlankerResponseValue.Right;
    responseValue =
      response.button_pressed === null || response.button_pressed === undefined ? DEFAULT_VALUE : buttonPressed;
    responseAccuracy = response.correct ? FlankerResponseAccuracy.Correct : FlankerResponseAccuracy.Incorrect;
    responseTouchTimestamp =
      'response_touch_timestamp' in response
        ? response.response_touch_timestamp || DEFAULT_VALUE
        : videoDisplayRequestTimestamp + (<DecryptedFlankerAnswerItemValue>response).duration;
    responseTime = response.duration;
    videoDisplayRequestTimestamp = DEFAULT_VALUE;
  }

  return {
    [FlankerRecordFields.BlockNumber]: blockNumber,
    [FlankerRecordFields.TrialNumber]: trialNumber,
    [FlankerRecordFields.TrialType]: trialType,
    [FlankerRecordFields.EventType]: eventType,
    [FlankerRecordFields.ResponseValue]: responseValue,
    [FlankerRecordFields.ResponseAccuracy]: responseAccuracy,
    [FlankerRecordFields.VideoDisplayRequestTimestamp]: videoDisplayRequestTimestamp,
    [FlankerRecordFields.ResponseTouchTimestamp]: responseTouchTimestamp,
    [FlankerRecordFields.ResponseTime]: responseTime,
    [FlankerRecordFields.EventStartTimestamp]: eventStartTimestamp,
    [FlankerRecordFields.EventOffset]: eventOffset,
    [FlankerRecordFields.FailedPractice]: '',
  };
};

const TIME_FIELDS = [
  FlankerRecordFields.ExperimentClock,
  FlankerRecordFields.BlockClock,
  FlankerRecordFields.TrialStartTimestamp,
  FlankerRecordFields.EventStartTimestamp,
  FlankerRecordFields.VideoDisplayRequestTimestamp,
  FlankerRecordFields.ResponseTouchTimestamp,
  FlankerRecordFields.TrialOffset,
  FlankerRecordFields.EventOffset,
  FlankerRecordFields.ResponseTime,
];

const DEFAULT_VALUE = '.';

export const getFlankerRecords = ({
  responses,
  item,
  experimentClock,
  itemIndex,
}: {
  responses: DecryptedFlankerAnswerItemValue[];
  item: FlankerItem;
  experimentClock: string;
  itemIndex: number;
}) => {
  const result: Record<FlankerRecordFields, unknown>[] = [];
  let trialStartTimestamp = 0;
  let lastIndex = 1e6;
  let totalCount = 0;
  let correctCount = 0;
  let failedPractice = 0;
  const types = getTypes(item.config.stimulusTrials);

  if (item.config.minimumAccuracy) {
    for (let index = responses.length - 1; index >= 0; index--) {
      const response = responses[index];
      if (response.trial_index > lastIndex) {
        if ((correctCount / totalCount) * 100 < item.config.minimumAccuracy) {
          failedPractice++;
        }

        correctCount = totalCount = 0;
      }

      lastIndex = response.trial_index;

      if (response.tag === FlankerTag.Trial) {
        totalCount++;

        if (response.correct) {
          correctCount++;
        }
      }
    }

    if ((correctCount / totalCount) * 100 < item.config.minimumAccuracy) {
      failedPractice++;
    }
  }

  let lastTrialIndex = -1;

  for (let index = 0; index < responses.length; index++) {
    const blockClock = responses[0].start_timestamp;
    const response = responses[index];
    if (lastTrialIndex !== response.trial_index) {
      trialStartTimestamp = response.start_timestamp;
      lastTrialIndex = response.trial_index;
    }

    const row = {
      ...getResponseObj({
        response,
        tag: response.tag,
        itemIndex,
        trialStartTimestamp,
        types,
      }),
      [FlankerRecordFields.BlockClock]: blockClock,
      [FlankerRecordFields.ExperimentClock]: experimentClock,
      [FlankerRecordFields.TrialStartTimestamp]: trialStartTimestamp,
      [FlankerRecordFields.TrialOffset]: trialStartTimestamp - blockClock,
    };
    result.push(row);

    if (response.tag === FlankerTag.Trial) {
      result.push({
        ...getResponseObj({
          response,
          tag: FlankerTag.Response,
          itemIndex,
          trialStartTimestamp,
          types,
        }),
        [FlankerRecordFields.BlockClock]: DEFAULT_VALUE,
        [FlankerRecordFields.ExperimentClock]: DEFAULT_VALUE,
        [FlankerRecordFields.TrialStartTimestamp]: DEFAULT_VALUE,
        [FlankerRecordFields.TrialOffset]: trialStartTimestamp - blockClock,
      });
    }
  }

  for (let index = 0; index < result.length; index++) {
    const row = result[index];
    if (row.trialType === -1) {
      row.trialType = result[index + 1].trialType;
    }

    if (row.trialType === 0) {
      row.trialType = result[index - 1].trialType;
    }

    for (const field of TIME_FIELDS) {
      if (row[field] !== DEFAULT_VALUE) {
        row[field] = Number((row[field] as number) / 1000).toFixed(3);
      }
    }
  }

  return result.map((row, index) => ({
    block_number: row.blockNumber,
    trial_number: row.trialNumber,
    trial_type: row.trialType,
    event_type: row.eventType,
    experiment_start_timestamp: row.experimentClock,
    block_start_timestamp: row.blockClock,
    trial_start_timestamp: row.trialStartTimestamp,
    event_start_timestamp: row.eventStartTimestamp,
    video_display_request_timestamp: row.videoDisplayRequestTimestamp,
    response_touch_timestamp: row.responseTouchTimestamp,
    trial_offset: row.trialOffset,
    event_offset: row.eventOffset,
    response_time: row.responseTime,
    response: row.responseValue,
    response_accuracy: row.responseAccuracy,
    ...(item.config.minimumAccuracy && index === 0 ? { failed_practices: failedPractice.toString() } : {}),
  }));
};
