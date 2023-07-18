import { FlankerConfig, Item } from 'shared/state';
import {
  DecryptedFlankerAnswer,
  DecryptedFlankerAnswerItemValue,
  DotType,
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

export const getResponseObj = ({
  response,
  tag,
  config,
  trialStartTimestamp,
  types,
}: {
  response: DecryptedFlankerAnswerItemValue;
  tag: FlankerTag;
  config: FlankerConfig;
  trialStartTimestamp: number;
  types: ReturnType<typeof getTypes>;
}) => {
  const trialNumber = response.trial_index;
  const blockNumber = config.blockIndex ?? 0;
  const trialType: number | string = getTrialType({
    tag,
    types,
    response,
  });
  const eventType = getEventType(tag);

  let responseValue: DotType | 'L' | 'R' = '.';
  let responseAccuracy: DotType | '1' | '0' = '.';
  let responseTouchTimestamp: NumberWithDotType = '.';
  let responseTime: NumberWithDotType = '.';
  let videoDisplayRequestTimestamp: NumberWithDotType = response.start_time + response.offset;
  let eventStartTimestamp: NumberWithDotType = response.start_timestamp;
  let eventOffset: NumberWithDotType = eventStartTimestamp - trialStartTimestamp;

  if (tag === FlankerTag.Response) {
    eventOffset = eventStartTimestamp = '.';
    const buttonPressed = response.button_pressed === CorrectPress.Left ? 'L' : 'R';
    responseValue =
      response.button_pressed === null || response.button_pressed === undefined
        ? '.'
        : buttonPressed;
    responseAccuracy = response.correct ? '1' : '0';
    responseTouchTimestamp =
      'response_touch_timestamp' in response
        ? response.response_touch_timestamp || '.'
        : videoDisplayRequestTimestamp + response.duration;
    responseTime = response.duration;
    videoDisplayRequestTimestamp = '.';
  }

  return {
    blockNumber,
    trialNumber,
    trialType,
    eventType,
    responseValue,
    responseAccuracy,
    videoDisplayRequestTimestamp,
    responseTouchTimestamp,
    responseTime,
    eventStartTimestamp,
    eventOffset,
    failedPractice: '',
  };
};

export const enum FlankerRecordFields {
  ExperimentClock = 'experimentClock',
  BlockClock = 'blockClock',
  TrialStartTimestamp = 'trialStartTimestamp',
  EventStartTimestamp = 'eventStartTimestamp',
  VideoDisplayRequestTimestamp = 'videoDisplayRequestTimestamp',
  ResponseTouchTimestamp = 'responseTouchTimestamp',
  TrialOffset = 'trialOffset',
  EventOffset = 'eventOffset',
  ResponseTime = 'responseTime',
  BlockNumber = 'blockNumber',
  TrialNumber = 'trialNumber',
  TrialType = 'trialType',
  EventType = 'eventType',
  ResponseValue = 'responseValue',
  ResponseAccuracy = 'responseAccuracy',
  FailedPractice = 'failedPractice',
}

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

export const getFlankerRecords = (
  responses: DecryptedFlankerAnswer['value'],
  item: Item<FlankerConfig>,
  experimentClock: number,
) => {
  const result: any[] = [];
  let trialStartTimestamp = 0;
  let lastIndex = 1e6;
  let totalCount = 0;
  let correctCount = 0;
  let failedPractice = 0;
  const types = getTypes(item.config.stimulusTrials);

  if (item.config.minimumAccuracy) {
    for (let i = responses.length - 1; i >= 0; i--) {
      if (responses[i].trial_index > lastIndex) {
        if ((correctCount / totalCount) * 100 < item.config.minimumAccuracy) {
          failedPractice++;
        }

        correctCount = totalCount = 0;
      }

      lastIndex = responses[i].trial_index;

      if (responses[i].tag === FlankerTag.Trial) {
        totalCount++;

        if (responses[i].correct) {
          correctCount++;
        }
      }
    }

    if ((correctCount / totalCount) * 100 < item.config.minimumAccuracy) {
      failedPractice++;
    }
  }

  let lastTrialIndex = -1;

  for (let i = 0; i < responses.length; i++) {
    const blockClock = responses[0].start_timestamp;

    if (lastTrialIndex !== responses[i].trial_index) {
      trialStartTimestamp = responses[i].start_timestamp;
      lastTrialIndex = responses[i].trial_index;
    }

    const response = {
      ...getResponseObj({
        response: responses[i],
        tag: responses[i].tag,
        config: item.config,
        trialStartTimestamp,
        types,
      }),
      blockClock,
      experimentClock,
      trialStartTimestamp,
      trialOffset: trialStartTimestamp - blockClock,
    };
    result.push(response);

    if (responses[i].tag === FlankerTag.Trial) {
      result.push({
        ...getResponseObj({
          response: responses[i],
          tag: FlankerTag.Response,
          config: item.config,
          trialStartTimestamp,
          types,
        }),
        [FlankerRecordFields.BlockClock]: '.',
        [FlankerRecordFields.ExperimentClock]: '.',
        [FlankerRecordFields.TrialStartTimestamp]: '.',
        [FlankerRecordFields.TrialOffset]: trialStartTimestamp - blockClock,
      });
    }
  }

  for (let i = 0; i < result.length; i++) {
    if (result[i].trialType === -1) {
      result[i].trialType = result[i + 1].trialType;
    }

    if (result[i].trialType === 0) {
      result[i].trialType = result[i - 1].trialType;
    }

    for (const field of TIME_FIELDS) {
      if (result[i][field] !== '.') {
        result[i][field] = Number((result[i][field] as number) / 1000).toFixed(3);
      }
    }
  }

  return result.map((resultItem, index) => ({
    block_number: resultItem.blockNumber,
    trial_number: resultItem.trialNumber,
    trial_type: resultItem.trialType,
    event_type: resultItem.eventType,
    experiment_start_timestamp: resultItem.experimentClock,
    block_start_timestamp: resultItem.blockClock,
    trial_start_timestamp: resultItem.trialStartTimestamp,
    event_start_timestamp: resultItem.eventStartTimestamp,
    video_display_request_timestamp: resultItem.videoDisplayRequestTimestamp,
    response_touch_timestamp: resultItem.responseTouchTimestamp,
    trial_offset: resultItem.trialOffset,
    event_offset: resultItem.eventOffset,
    response_time: resultItem.responseTime,
    response: resultItem.responseValue,
    response_accuracy: resultItem.responseAccuracy,
    failed_practices:
      item.config.minimumAccuracy && index === 0 ? failedPractice.toString() : undefined,
  }));
};
