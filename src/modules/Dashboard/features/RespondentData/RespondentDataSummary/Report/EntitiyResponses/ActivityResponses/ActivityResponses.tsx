import { ResponseOptions } from '../../ResponseOptions';
import { Subscales } from '../../Subscales';
import { sortResponseOptions } from './ActivityResponses.utils';
import { ActivityResponsesProps } from './ActivityResponses.types';

export const ActivityResponses = ({
  answers,
  versions,
  subscalesFrequency,
  responseOptions,
  flowResponsesIndex,
}: ActivityResponsesProps) => (
  <>
    {!!subscalesFrequency && (
      <Subscales answers={answers} versions={versions} subscalesFrequency={subscalesFrequency} />
    )}
    {responseOptions && !!Object.values(responseOptions).length && (
      <ResponseOptions
        responseOptions={sortResponseOptions(responseOptions)}
        versions={versions}
        flowResponsesIndex={flowResponsesIndex}
      />
    )}
  </>
);
