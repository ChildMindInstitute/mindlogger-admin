import { useState } from 'react';

import { ResetForm } from '../../features/ResetPassword/ResetForm';
import { Confirmation } from '../../features/ResetPassword/Confirmation';

export const ResetPassword = () => {
  const [email, setEmail] = useState('');

  return <>{email ? <Confirmation email={email} /> : <ResetForm setEmail={setEmail} />}</>;
};
