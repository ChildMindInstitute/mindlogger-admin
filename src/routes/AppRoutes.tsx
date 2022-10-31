import { Navigate, Route, Routes } from 'react-router-dom';

import { Login } from 'pages/Login';
import { ResetPassword } from 'pages/ResetPassword';
import { AuthLayout } from 'components/AuthLayout';
import { SignUp } from 'pages/SignUp';

export const AppRoutes = () => (
  <>
    <Routes>
      {/* TODO: fix when new routes come out */}
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="/auth" element={<Login />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
);
