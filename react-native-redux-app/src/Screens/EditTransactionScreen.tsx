import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDispatch } from 'react-redux';
import { updateTransaction, deleteTransaction } from '../Redux/Slices/financialSlice';
import { Ionicons } from '@expo/vector-icons';

export default function EditTransactionScreen() {
  console.log('EditTransactionScreen mounted');
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const {
    id,
    type,
    title,
    amount: initialAmount,
    date: initialDate,
  } = params;

  const [amount, setAmount] = useState(initialAmount ? String(initialAmount) : '');
  const [date, setDate] = useState(toDisplayDate(initialDate || ''));
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

  const handleSave = () => {
    if (!amount || !date) return;
    if (!validateDate(date)) return;
    const backendDate = toBackendDate(date);
    const numericAmount = parseInt(amount.replace(/\./g, ''), 10);
    dispatch(updateTransaction({
      id,
      updates: {
        type,
        title,
        amount: numericAmount,
        date: backendDate,
      },
    }));
    router.back();
  };

  const handleDelete = () => {
    console.log('Delete transaction id:', id);
    if (!id) {
      Alert.alert('Error', 'Transaction ID is invalid!');
      return;
    }
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
            console.log('Alert callback: deleting transaction', id);
            dispatch(deleteTransaction(String(id)));
            setTimeout(() => {
              console.log('After dispatch, should navigate back');
              router.back();
            }, 200);
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit {type === 'income' ? 'Income' : 'Expense'}</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Type</Text>
        <View style={styles.input}>
          <Text style={styles.inputText}>{title}</Text>
        </View>
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
          style={[styles.saveButton, (!amount || !date || dateError) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!amount || !date || !!dateError}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            console.log('TouchableOpacity onPress Delete');
            handleDelete();
          }}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
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
  saveButton: {
    backgroundColor: '#3B82F6',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  saveButtonDisabled: {
    backgroundColor: '#B0C4DE',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  deleteButtonText: {
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

// Helper to convert YYYY-MM-DD to DD/MM/YYYY
const toDisplayDate = (dateStr: string) => {
  if (!dateStr) return '';
  if (dateStr.includes('/')) return dateStr;
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;
  return `${day}/${month}/${year}`;
};

// Helper to convert DD/MM/YYYY to YYYY-MM-DD
const toBackendDate = (dateStr: string) => {
  if (!dateStr) return '';
  if (dateStr.includes('-')) return dateStr;
  const [day, month, year] = dateStr.split('/');
  if (!year || !month || !day) return dateStr;
  return `${year}-${month}-${day}`;
}; 