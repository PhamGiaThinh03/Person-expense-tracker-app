import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddCustomCategoryModal from '../AddCustomCategoryModal';

describe('AddCustomCategoryModal', () => {
  it('renders with title', () => {
    const { getByText } = render(
      <AddCustomCategoryModal isVisible title="Add Category" onAdd={jest.fn()} onClose={jest.fn()} />
    );
    expect(getByText('Add Category')).toBeTruthy();
  });
  it('calls onAdd and onClose', () => {
    const onAdd = jest.fn();
    const onClose = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <AddCustomCategoryModal isVisible title="Add Category" onAdd={onAdd} onClose={onClose} />
    );
    fireEvent.changeText(getByPlaceholderText('Enter category name'), 'Food');
    fireEvent.press(getByText('Add'));
    expect(onAdd).toHaveBeenCalledWith('Food');
    // onClose is called after add
    expect(onClose).toHaveBeenCalled();
  });
}); 