import { useState } from 'react';

import {
  FlowSubmission,
  FlowResponses,
  ActivityCompletion,
  ResponseOption,
  ActivityOrFlow,
  Identifier,
} from 'modules/Dashboard/features/RespondentData/RespondentData.types';
import { DatavizEntity, Version } from 'modules/Dashboard/api';

import { DataSummaryContext } from './DataSummaryContext.context';
import { DataSummaryContextProviderProps } from './DataSummaryContext.types';

export const DataSummaryContextProvider = ({ children }: DataSummaryContextProviderProps) => {
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
    <DataSummaryContext.Provider
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
    </DataSummaryContext.Provider>
  );
};
