import api, { setAuthToken } from './api';

describe('api service', () => {
  it('sets Authorization header when token is provided', () => {
    setAuthToken('abc123');
    expect(api.defaults.headers.common['Authorization']).toBe('Bearer abc123');
  });
  it('removes Authorization header when token is falsy', () => {
    setAuthToken();
    expect(api.defaults.headers.common['Authorization']).toBeUndefined();
  });
}); 