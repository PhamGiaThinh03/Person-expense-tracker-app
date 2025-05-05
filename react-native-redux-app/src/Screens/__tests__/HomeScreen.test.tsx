import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import HomeScreen from '../HomeScreen';

const mockStore = configureStore([]);

describe('HomeScreen', () => {
  it('renders main sections and transaction list', () => {
    const store = mockStore({ financial: { transactions: [{ id: '1', title: 'Coffee', amount: 30, type: 'expense', date: '2024-06-01' }] } });
    const { getByText } = render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );
    expect(getByText('Coffee')).toBeTruthy();
    // Có thể kiểm tra các section khác nếu cần
  });
}); 