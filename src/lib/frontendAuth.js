import Cookies from 'js-cookie';

const cookieOptions = {
  expires: 1,
  path: '/',
  sameSite: 'lax',
};

export const setFrontendAuthState = (role) => {
  Cookies.set('auth_status', '1', cookieOptions);
  Cookies.set('auth_role', role, cookieOptions);
  Cookies.remove('token', { path: '/' });
};

export const clearFrontendAuthState = () => {
  Cookies.remove('auth_status', { path: '/' });
  Cookies.remove('auth_role', { path: '/' });
  Cookies.remove('token', { path: '/' });
};