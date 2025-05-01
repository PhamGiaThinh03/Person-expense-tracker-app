import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import { addTransaction, setSelectedDate } from '../Redux/Slices/financialSlice';
import { Ionicons } from '@expo/vector-icons';

export default function AddExpenseScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedExpenseType = useSelector((state: RootState) => state.financial.selectedExpenseType);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [dateError, setDateError] = useState('');

  const formatNumber = (num: string) => {
    const cleanNum = num.replace(/\D/g, '');
    return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleAmountChange = (text: string) => {
    const formattedAmount = formatNumber(text);
    setAmount(formattedAmount);
  };

  const validateDate = (input: string) => {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dateRegex.test(input)) {
      setDateError('Please enter date in DD/MM/YYYY format');
      return false;
    }

    const [day, month, year] = input.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      setDateError('Please enter a valid date');
      return false;
    }

    setDateError('');
    return true;
  };

  const handleDateChange = (text: string) => {
    const numbersOnly = text.replace(/\D/g, '');
    
    let formattedDate = '';
    if (numbersOnly.length > 0) {
      formattedDate = numbersOnly.substring(0, 2);
      if (numbersOnly.length > 2) {
        formattedDate += '/' + numbersOnly.substring(2, 4);
      }
      if (numbersOnly.length > 4) {
        formattedDate += '/' + numbersOnly.substring(4, 8);
      }
    }

    setDate(formattedDate);
    
    if (formattedDate.length === 10) {
      validateDate(formattedDate);
    } else {
      setDateError('');
    }
  };

  const handleSubmit = () => {
    if (!selectedExpenseType || !amount || !date) {
      return;
    }

    if (!validateDate(date)) {
      return;
    }

    const [day, month, year] = date.split('/');
    const formattedDate = `${year}-${month}-${day}`;
    const numericAmount = parseInt(amount.replace(/\./g, ''), 10);

    dispatch(setSelectedDate(formattedDate));
    dispatch(addTransaction({
      id: Date.now().toString(),
      type: 'expense',
      title: selectedExpenseType,
      amount: numericAmount,
      date: formattedDate,
      category: selectedExpenseType,
    }));

    router.push('/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Add expense</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Category</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => router.push('/select-expense')}
        >
          <Text style={selectedExpenseType ? styles.inputText : styles.placeholder}>
            {selectedExpenseType || 'Select expense'}
          </Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <Text style={styles.label}>Amount</Text>
        <View style={styles.input}>
          <TextInput
            style={styles.inputText}
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            placeholder="Enter amount"
            placeholderTextColor="#666"
          />
          <Text style={styles.currencyText}>đ</Text>
        </View>

        <Text style={styles.label}>Date</Text>
        <View style={styles.input}>
          <TextInput
            style={styles.inputText}
            value={date}
            onChangeText={handleDateChange}
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#666"
            maxLength={10}
            keyboardType="numeric"
          />
        </View>
        {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!selectedExpenseType || !amount || !date || dateError) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!selectedExpenseType || !amount || !date || !!dateError}
        >
          <Text style={styles.submitButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#000',
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 16,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  currencyText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  placeholder: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#EB5757',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#FFB5B5',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
  },
}); 