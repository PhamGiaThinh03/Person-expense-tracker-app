import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { addBudget, setSelectedExpenseType } from '../Redux/Slices/financialSlice';

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);

const formatNumber = (num: string) => {
  const cleanNum = num.replace(/\D/g, '');
  return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const isValidDateFormat = (date: string): boolean => {
  if (!date) return true;
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  return dateRegex.test(date);
};

const isStartDateBeforeOrEqual = (startDate: string, endDate: string): boolean => {
  const start = dayjs(startDate, 'DD/MM/YYYY');
  const end = dayjs(endDate, 'DD/MM/YYYY');
  return start.isSameOrBefore(end);
};

type ErrorsType = {
  category?: string;
  amount?: string;
  startDate?: string;
  endDate?: string;
  dateRange?: string;
};

export default function AddBudgetScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state: any) => state.financial.selectedExpenseType);

  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState<ErrorsType>({});

  const handleAmountChange = (text: string) => {
    const formattedAmount = formatNumber(text);
    setAmount(formattedAmount);
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
    const formattedDate = formatDateInput(text);
    setStartDate(formattedDate);
    if (formattedDate.length === 10 && endDate.length === 10) {
      validateDates(formattedDate, endDate);
    }
  };

  const handleEndDateChange = (text: string) => {
    const formattedDate = formatDateInput(text);
    setEndDate(formattedDate);
    if (startDate.length === 10 && formattedDate.length === 10) {
      validateDates(startDate, formattedDate);
    }
  };

  const validateDates = (start: string, end: string) => {
    const newErrors: ErrorsType = { ...errors, startDate: undefined, endDate: undefined, dateRange: undefined };

    if (!isValidDateFormat(start)) {
      newErrors.startDate = 'Invalid date format (DD/MM/YYYY)';
    }
    if (!isValidDateFormat(end)) {
      newErrors.endDate = 'Invalid date format (DD/MM/YYYY)';
    }

    if (isValidDateFormat(start) && isValidDateFormat(end) && !isStartDateBeforeOrEqual(start, end)) {
      newErrors.dateRange = 'End date must be after or equal to start date';
    }

    setErrors(newErrors);

    return (Object.keys(newErrors) as (keyof ErrorsType)[]).every((key) => !newErrors[key]);
  };

  const validateForm = () => {
    const newErrors: ErrorsType = {};

    if (!selectedCategory) {
      newErrors.category = 'Please select a category';
    }

    if (!amount || parseInt(amount.replace(/\./g, ''), 10) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!startDate) {
      newErrors.startDate = 'Please enter start date';
    } else if (!isValidDateFormat(startDate)) {
      newErrors.startDate = 'Invalid date format (DD/MM/YYYY)';
    }

    if (!endDate) {
      newErrors.endDate = 'Please enter end date';
    } else if (!isValidDateFormat(endDate)) {
      newErrors.endDate = 'Invalid date format (DD/MM/YYYY)';
    }

    if (isValidDateFormat(startDate) && isValidDateFormat(endDate)) {
      if (!isStartDateBeforeOrEqual(startDate, endDate)) {
        newErrors.dateRange = 'End date must be after or equal to start date';
      }
    }

    setErrors(newErrors);
    return (Object.keys(newErrors) as (keyof ErrorsType)[]).every((key) => !newErrors[key]);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const numericAmount = parseInt(amount.replace(/\./g, ''), 10);
      const [startDay, startMonth, startYear] = startDate.split('/').map(Number);
      const [endDay, endMonth, endYear] = endDate.split('/').map(Number);

      dispatch(addBudget({
        id: Date.now().toString(),
        category: selectedCategory!,
        amount: numericAmount,
        startDate: `${startYear}-${String(startMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`,
        endDate: `${endYear}-${String(endMonth).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`,
      }));

      dispatch(setSelectedExpenseType(''));
      router.push('/home');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          dispatch(setSelectedExpenseType(''));
          router.push('/home');
        }}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Budget</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.label}>Category</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => router.push('/select-budget-category')}
        >
          <Text style={selectedCategory ? styles.inputText : styles.placeholder}>
            {selectedCategory || 'Select category'}
          </Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
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

        {errors.dateRange && <Text style={styles.errorText}>{errors.dateRange}</Text>}

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!selectedCategory || !amount || !startDate || !endDate || Object.values(errors).some(Boolean)) &&
            styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!selectedCategory || !amount || !startDate || !endDate || Object.values(errors).some(Boolean)}
        >
          <Text style={styles.submitButtonText}>Add Budget</Text>
        </TouchableOpacity>
      </ScrollView>
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
  placeholder: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  currencyText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  errorText: {
    color: '#EB5757',
    fontSize: 14,
    marginTop: -12,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#2F80ED',
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
});
