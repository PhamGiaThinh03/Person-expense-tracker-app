import userReducer, { updateUserInfo, clearUserInfo } from './userSlice';

describe('userSlice', () => {
  it('should update user info', () => {
    const initialState = { userInfo: null };
    const user = { name: 'John', phone: '0123456789', dateOfBirth: '01/01/2000' };
    const state = userReducer(initialState, updateUserInfo(user));
    expect(state.userInfo).toEqual(user);
  });
  it('should clear user info', () => {
    const initialState = { userInfo: { name: 'John' } };
    const state = userReducer(initialState, clearUserInfo());
    expect(state.userInfo).toBeNull();
  });
}); 