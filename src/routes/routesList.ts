import { page } from 'resources';
import { Login } from 'pages/Login';
import { ResetPassword } from 'pages/ResetPassword';
import { SignUp } from 'pages/SignUp';

export const authRoutes = [
  {
    path: page.login,
    Component: Login,
  },
  {
    path: page.signUp,
    Component: SignUp,
  },
  {
    path: page.passwordReset,
    Component: ResetPassword,
  },
];
