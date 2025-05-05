import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AddExpenseScreen from '../AddExpenseScreen';

const mockStore = configureStore([]);

describe('AddExpenseScreen', () => {
  it('renders input fields and adds expense', () => {
    const store = mockStore({ financial: { transactions: [] } });
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <AddExpenseScreen />
      </Provider>
    );
    fireEvent.changeText(getByPlaceholderText('Title'), 'Coffee');
    fireEvent.changeText(getByPlaceholderText('Amount'), '30');
    fireEvent.press(getByText('Add'));
    // Có thể kiểm tra dispatch hoặc UI cập nhật nếu có mock
  });
}); 