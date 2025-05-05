import React from 'react';
import { render } from '@testing-library/react-native';
import ScreenWrapper from '../ScreenWrapper';

describe('ScreenWrapper', () => {
  it('renders children', () => {
    const { getByText } = render(
      <ScreenWrapper><React.Fragment><Text>Test</Text></React.Fragment></ScreenWrapper>
    );
    expect(getByText('Test')).toBeTruthy();
  });
  it('renders scrollable content', () => {
    const { getByText } = render(
      <ScreenWrapper scrollable><React.Fragment><Text>Scrollable</Text></React.Fragment></ScreenWrapper>
    );
    expect(getByText('Scrollable')).toBeTruthy();
  });
}); 