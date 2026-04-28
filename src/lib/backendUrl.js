const stripTrailingSlash = (value) => value.replace(/\/+$/, '');

export const getBackendBaseUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

  if (configuredUrl) {
    return stripTrailingSlash(configuredUrl);
  }

  if (typeof window === 'undefined') {
    return 'http://localhost:8000';
  }

  return '/laravel';
};

export const getBackendUrl = (path = '') => {
  const baseUrl = getBackendBaseUrl();

  if (!path) {
    return baseUrl;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
};