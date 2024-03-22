import { Dispatch, SetStateAction } from 'react';

import { DatavizActivity } from 'api';

import { FetchAnswers, GetIdentifiersVersions } from '../../RespondentData.types';

export type ReportMenuProps = {
  activities: DatavizActivity[];
  getIdentifiersVersions: (params: GetIdentifiersVersions) => Promise<void>;
  fetchAnswers: (params: FetchAnswers) => Promise<void>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};
