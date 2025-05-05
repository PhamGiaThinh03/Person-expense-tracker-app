import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ChartScreen from '../ChartScreen';

const mockStore = configureStore([]);

describe('ChartScreen', () => {
  it('renders chart title and report label', () => {
    const store = mockStore({ financial: { transactions: [] } });
    const { getByText } = render(
      <Provider store={store}>
        <ChartScreen />
      </Provider>
    );
    expect(getByText('Analytics')).toBeTruthy();
    expect(getByText('Report chart')).toBeTruthy();
  });
}); 