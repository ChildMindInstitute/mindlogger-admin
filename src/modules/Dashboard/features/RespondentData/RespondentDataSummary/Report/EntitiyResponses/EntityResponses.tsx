import { ActivityResponses } from './ActivityResponses';
import { EntityResponsesProps } from './EntityResponses.types';
import { FlowActivityResponses } from './FlowActivityResponses';

export const EntityResponses = ({
  isFlow,
  flowResponses,
  answers,
  responseOptions,
  subscalesFrequency,
  versions,
  'data-testid': dataTestId,
}: EntityResponsesProps) => {
  if (isFlow) {
    return (
      <>
        {flowResponses.map(({ activityId, ...rest }, index) => (
          <FlowActivityResponses
            key={activityId}
            activityId={activityId}
            versions={versions}
            flowResponsesIndex={index + 1}
            data-testid={`${dataTestId}-flow`}
            {...rest}
          />
        ))}
      </>
    );
  }

  return (
    <ActivityResponses
      answers={answers}
      versions={versions}
      subscalesFrequency={subscalesFrequency}
      responseOptions={responseOptions}
      data-testid={`${dataTestId}-activity`}
    />
  );
};
