
export const AuthSelectors = {
  pageTitle: "",
  loggedInPath: /dashboard\/applets/,
  loginPath: '/auth',
  fields: {
    username: 'input[autocomplete="username"]',
    password: 'input[autocomplete="password"]',
    confirmPassword: 'input[name="confirmPassword"]',
    submitButton: 'button[type="submit"]',
    firstName: 'input[name="firstName"]',
    lastName: 'input[name="lastName"]'
  },
  role: {
    email: 'Email',
    firstName: 'First Name',
    lastName: 'Last Name',
    password: 'Password',
    terms: 'I agree to the Master'
  },
  testId: {
    createAccountButton: 'signup-form-signup'
  }
}
