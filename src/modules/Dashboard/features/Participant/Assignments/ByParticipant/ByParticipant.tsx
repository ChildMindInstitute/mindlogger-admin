import { useTranslation } from 'react-i18next';

import { AssignmentsTab } from '../AssignmentsTab';

const ByParticipant = () => {
  const { t } = useTranslation();

  return <AssignmentsTab />;
};

export default ByParticipant;
