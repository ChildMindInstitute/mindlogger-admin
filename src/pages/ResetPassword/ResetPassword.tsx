import { useState } from 'react';

import { Confirmation } from './components/Confirmation';
import { ResetForm } from './components/ResetForm';

export const ResetPassword = () => {
  const [email, setEmail] = useState('');

  return <>{email ? <Confirmation email={email} /> : <ResetForm setEmail={setEmail} />}</>;
};
