import { useState } from 'react';

import { DatavizEntity, Version } from 'modules/Dashboard/api';

import {
  FlowSubmission,
  FlowResponses,
  ActivityCompletion,
  ResponseOption,
  ActivityOrFlow,
  Identifier,
} from '../RespondentData.types';
import { RespondentDataContext } from './RespondentDataContext.context';
import { RespondentDataContextProps } from './RespondentDataContext.types';

export const RespondentDataContextProvider = ({ children }: RespondentDataContextProps) => {
  const [summaryActivities, setSummaryActivities] = useState<DatavizEntity[]>([]);
  const [summaryFlows, setSummaryFlows] = useState<DatavizEntity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<ActivityOrFlow | null>(null);
  const [answers, setAnswers] = useState<ActivityCompletion[]>([]);
  const [responseOptions, setResponseOptions] = useState<ResponseOption | null>(null);
  const [subscalesFrequency, setSubscalesFrequency] = useState(0);
  const [flowSubmissions, setFlowSubmissions] = useState<FlowSubmission[]>([]);
  const [flowResponses, setFlowResponses] = useState<FlowResponses[]>([]);
  const [flowResponseOptionsCount, setFlowResponseOptionsCount] = useState(0);
  const [identifiers, setIdentifiers] = useState<Identifier[]>([]);
  const [apiVersions, setApiVersions] = useState<Version[]>([]);

  return (
    <RespondentDataContext.Provider
      value={{
        flowSubmissions,
        setFlowSubmissions,
        flowResponses,
        setFlowResponses,
        selectedEntity,
        setSelectedEntity,
        flowResponseOptionsCount,
        setFlowResponseOptionsCount,
        summaryActivities,
        setSummaryActivities,
        summaryFlows,
        setSummaryFlows,
        answers,
        setAnswers,
        responseOptions,
        setResponseOptions,
        subscalesFrequency,
        setSubscalesFrequency,
        identifiers,
        setIdentifiers,
        apiVersions,
        setApiVersions,
      }}
    >
      {children}
    </RespondentDataContext.Provider>
  );
};
