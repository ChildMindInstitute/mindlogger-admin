import { useContext } from 'react';

import { RespondentDataContext } from './RespondentDataContext.context';

export const useRespondentDataContext = () => useContext(RespondentDataContext);
