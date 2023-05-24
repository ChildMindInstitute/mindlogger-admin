import { useParams } from 'react-router-dom';

import { users } from 'redux/modules';
import { getRespondentLabel } from '../features/RespondentData/RespondentData.utils';

export const useRespondentLabel = () => {
  const { respondentId } = useParams();
  const { details } = users.useRespondent(respondentId || '') || {};

  return getRespondentLabel(details);
};
