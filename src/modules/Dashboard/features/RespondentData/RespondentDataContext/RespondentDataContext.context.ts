import { createContext } from 'react';

import { nullReturnFunc } from 'shared/utils';

import { RespondentDataContextType } from './RespondentDataContext.types';

export const RespondentDataContext = createContext<RespondentDataContextType>({
  identifiers: [],
  setIdentifiers: nullReturnFunc,
  apiVersions: [],
  setApiVersions: nullReturnFunc,
  summaryActivities: [],
  setSummaryActivities: nullReturnFunc,
  summaryFlows: [],
  setSummaryFlows: nullReturnFunc,
  selectedEntity: null,
  setSelectedEntity: nullReturnFunc,
  answers: [],
  setAnswers: nullReturnFunc,
  responseOptions: null,
  setResponseOptions: nullReturnFunc,
  subscalesFrequency: 0,
  setSubscalesFrequency: nullReturnFunc,
  flowSubmissions: [],
  setFlowSubmissions: nullReturnFunc,
  flowResponses: [],
  setFlowResponses: nullReturnFunc,
  flowResponseOptionsCount: 0,
  setFlowResponseOptionsCount: nullReturnFunc,
});
