import { Dispatch, SetStateAction } from 'react';

import { DatavizEntity } from 'api';

import { FetchAnswers, GetIdentifiersVersions } from '../RespondentDataSummary.types';

export type ReportMenuProps = {
  activities: DatavizEntity[];
  flows: DatavizEntity[];
  getIdentifiersVersions: (params: GetIdentifiersVersions) => Promise<void>;
  fetchAnswers: (params: FetchAnswers) => Promise<void>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};
