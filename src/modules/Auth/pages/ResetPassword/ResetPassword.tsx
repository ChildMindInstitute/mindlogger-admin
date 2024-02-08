import { useState } from 'react';

import { Confirmation } from '../../features/ResetPassword/Confirmation';
import { ResetForm } from '../../features/ResetPassword/ResetForm';

export const ResetPassword = () => {
  const [email, setEmail] = useState('');

  return <>{email ? <Confirmation email={email} /> : <ResetForm setEmail={setEmail} />}</>;
};
