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
import { updateBudget, deleteBudget } from '../Redux/Slices/financialSlice';
import { Ionicons } from '@expo/vector-icons';

export default function EditBudgetScreen() {
  console.log('EditBudgetScreen mounted');
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const {
    id,
    category: initialCategory,
    amount: initialAmount,
    startDate: initialStartDate,
    endDate: initialEndDate,
  } = params;

  const [category, setCategory] = useState(initialCategory || '');
  const [amount, setAmount] = useState(initialAmount ? String(initialAmount) : '');
  const [startDate, setStartDate] = useState(toDisplayDate(initialStartDate || ''));
  const [endDate, setEndDate] = useState(toDisplayDate(initialEndDate || ''));
  const [errors, setErrors] = useState({});

  const formatNumber = (num: string) => {
    const cleanNum = num.replace(/\D/g, '');
    return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleAmountChange = (text: string) => {
    setAmount(formatNumber(text));
  };

  const formatDateInput = (text: string) => {
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
    return formattedDate;
  };

  const handleStartDateChange = (text: string) => {
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
    setStartDate(formattedDate);
  };

  const handleEndDateChange = (text: string) => {
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
    setEndDate(formattedDate);
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!category) newErrors.category = 'Please select a category';
    if (!amount || parseInt(amount.replace(/\./g, ''), 10) <= 0) newErrors.amount = 'Please enter a valid amount';
    if (!startDate || startDate.length !== 10) newErrors.startDate = 'Invalid start date';
    if (!endDate || endDate.length !== 10) newErrors.endDate = 'Invalid end date';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    const numericAmount = parseInt(amount.replace(/\./g, ''), 10);
    const backendStartDate = toBackendDate(startDate);
    const backendEndDate = toBackendDate(endDate);
    dispatch(updateBudget({
      id,
      updates: {
        category,
        amount: numericAmount,
        startDate: backendStartDate,
        endDate: backendEndDate,
      },
    }));
    router.back();
  };

  const handleDelete = () => {
    console.log('Delete budget id:', id);
    if (!id) {
      Alert.alert('Error', 'Budget ID is invalid!');
      return;
    }
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this budget?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
            console.log('Alert callback: deleting budget', id);
            dispatch(deleteBudget(String(id)));
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
        <Text style={styles.title}>Edit Budget</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.input}>
          <Text style={styles.inputText}>{category}</Text>
        </View>
        {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
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
        {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
        <Text style={styles.label}>Start Date</Text>
        <View style={styles.input}>
          <TextInput
            style={styles.inputText}
            value={startDate}
            onChangeText={handleStartDateChange}
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#666"
            maxLength={10}
            keyboardType="numeric"
          />
        </View>
        {errors.startDate && <Text style={styles.errorText}>{errors.startDate}</Text>}
        <Text style={styles.label}>End Date</Text>
        <View style={styles.input}>
          <TextInput
            style={styles.inputText}
            value={endDate}
            onChangeText={handleEndDateChange}
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#666"
            maxLength={10}
            keyboardType="numeric"
          />
        </View>
        {errors.endDate && <Text style={styles.errorText}>{errors.endDate}</Text>}
        <TouchableOpacity
          style={[styles.saveButton, Object.keys(errors).length > 0 && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={Object.keys(errors).length > 0}
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