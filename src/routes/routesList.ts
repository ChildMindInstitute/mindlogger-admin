import { Login } from 'pages/Login';
import { ResetPassword } from 'pages/ResetPassword';
import { SignUp } from 'pages/SignUp';

export const authRoutes = [
  {
    path: '/auth',
    Component: Login,
  },
  {
    path: '/auth/signup',
    Component: SignUp,
  },
  {
    path: '/auth/reset-password',
    Component: ResetPassword,
  },
];
