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

export default function AddIncomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedIncomeType = useSelector((state: RootState) => state.financial.selectedIncomeType);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [dateError, setDateError] = useState('');

  const formatNumber = (num: string) => {
    // Remove all non-digit characters
    const cleanNum = num.replace(/\D/g, '');
    // Format with dots
    return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleAmountChange = (text: string) => {
    // Remove any non-digit characters from input
    const formattedAmount = formatNumber(text);
    setAmount(formattedAmount);
  };

  const validateDate = (input: string) => {
    // Format: DD/MM/YYYY
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
    // Remove any non-digit characters from input
    const numbersOnly = text.replace(/\D/g, '');
    
    // Format the date with slashes
    let formattedDate = '';
    if (numbersOnly.length > 0) {
      // Add first two digits (DD)
      formattedDate = numbersOnly.substring(0, 2);
      if (numbersOnly.length > 2) {
        // Add next two digits (MM)
        formattedDate += '/' + numbersOnly.substring(2, 4);
      }
      if (numbersOnly.length > 4) {
        // Add last four digits (YYYY)
        formattedDate += '/' + numbersOnly.substring(4, 8);
      }
    }

    setDate(formattedDate);
    
    // Validate only if we have a complete date
    if (formattedDate.length === 10) {
      validateDate(formattedDate);
    } else {
      setDateError('');
    }
  };

  const handleSubmit = () => {
    if (!selectedIncomeType || !amount || !date) {
      return;
    }

    if (!validateDate(date)) {
      return;
    }

    const [day, month, year] = date.split('/');
    const formattedDate = `${year}-${month}-${day}`;
    // Convert amount string to number by removing dots and parsing
    const numericAmount = parseInt(amount.replace(/\./g, ''), 10);

    dispatch(setSelectedDate(formattedDate));
    dispatch(addTransaction({
      id: Date.now().toString(),
      type: 'income',
      title: selectedIncomeType,
      amount: numericAmount,
      date: formattedDate,
    }));

    // Navigate back to home screen
    router.push('/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Income</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Income Type Selection */}
        <Text style={styles.label}>Income Type</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => router.push('/select-income')}
        >
          <Text style={selectedIncomeType ? styles.inputText : styles.placeholder}>
            {selectedIncomeType || 'Select income type'}
          </Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        {/* Amount Input */}
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

        {/* Date Input */}
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

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!selectedIncomeType || !amount || !date || dateError) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!selectedIncomeType || !amount || !date || !!dateError}
        >
          <Text style={styles.submitButtonText}>Add Income</Text>
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
    backgroundColor: '#3B82F6',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#B0C4DE',
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
 