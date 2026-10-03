/**
 * SauceDemo credentials. Read from the environment when provided (see
 * `.env.example`), falling back to the public, documented demo credentials -
 * so the project stays clone-and-run while modelling real secret handling.
 */
export const VALID_USER = {
  username: process.env.SAUCE_USERNAME ?? 'standard_user',
  password: process.env.SAUCE_PASSWORD ?? 'secret_sauce',
};

/** Negative login scenarios, used to drive parametrized tests. */
export const LOGIN_SCENARIOS = [
  {
    name: 'locked-out user',
    username: 'locked_out_user',
    password: 'secret_sauce',
    error: 'locked out',
  },
  {
    name: 'wrong password',
    username: 'standard_user',
    password: 'wrong_password',
    error: 'Username and password do not match',
  },
  {
    name: 'missing password',
    username: 'standard_user',
    password: '',
    error: 'Password is required',
  },
  {
    name: 'missing username',
    username: '',
    password: 'secret_sauce',
    error: 'Username is required',
  },
] as const;
