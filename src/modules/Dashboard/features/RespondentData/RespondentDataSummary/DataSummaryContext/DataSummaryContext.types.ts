import { Dispatch, ReactNode, SetStateAction } from 'react';

import {
  FlowSubmission,
  FlowResponses,
  ActivityCompletion,
  ResponseOption,
  ActivityOrFlow,
  Identifier,
} from 'modules/Dashboard/features/RespondentData/RespondentData.types';
import { DatavizEntity, Version } from 'modules/Dashboard/api';

export type DataSummaryContextType = {
  identifiers: Identifier[];
  setIdentifiers: Dispatch<SetStateAction<Identifier[]>>;
  apiVersions: Version[];
  setApiVersions: Dispatch<SetStateAction<Version[]>>;
  selectedEntity: ActivityOrFlow | null;
  setSelectedEntity: Dispatch<SetStateAction<ActivityOrFlow | null>>;
  summaryActivities: DatavizEntity[];
  setSummaryActivities: Dispatch<SetStateAction<DatavizEntity[]>>;
  summaryFlows: DatavizEntity[];
  setSummaryFlows: Dispatch<SetStateAction<DatavizEntity[]>>;
  answers: ActivityCompletion[];
  setAnswers: Dispatch<SetStateAction<ActivityCompletion[]>>;
  responseOptions: ResponseOption | null;
  setResponseOptions: Dispatch<SetStateAction<ResponseOption | null>>;
  subscalesFrequency: number;
  setSubscalesFrequency: Dispatch<SetStateAction<number>>;
  flowSubmissions: FlowSubmission[];
  setFlowSubmissions: Dispatch<SetStateAction<FlowSubmission[]>>;
  flowResponses: FlowResponses[];
  setFlowResponses: Dispatch<SetStateAction<FlowResponses[]>>;
  flowResponseOptionsCount: number;
  setFlowResponseOptionsCount: Dispatch<SetStateAction<number>>;
};

export type DataSummaryContextProviderProps = { children: ReactNode };
