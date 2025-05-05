import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AddIncomeScreen from '../AddIncomeScreen';

const mockStore = configureStore([]);

describe('AddIncomeScreen', () => {
  it('renders input fields and adds income', () => {
    const store = mockStore({ financial: { transactions: [] } });
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <AddIncomeScreen />
      </Provider>
    );
    fireEvent.changeText(getByPlaceholderText('Title'), 'Salary');
    fireEvent.changeText(getByPlaceholderText('Amount'), '1000');
    fireEvent.press(getByText('Add'));
    // Có thể kiểm tra dispatch hoặc UI cập nhật nếu có mock
  });
}); 