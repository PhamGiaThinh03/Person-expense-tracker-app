import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserInfo } from '../Redux/Slices/userSlice';
import ScreenWrapper from '../Components/ScreenWrapper';

const PersonalInformationScreen = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.user.userInfo);

  const [name, setName] = useState(userInfo?.name || '');
  const [phone, setPhone] = useState(userInfo?.phone || '');
  const [dateOfBirth, setDateOfBirth] = useState(userInfo?.dateOfBirth || '');
  const [errors, setErrors] = useState({
    phone: '',
    dateOfBirth: '',
  });

  const validatePhone = (phoneNumber: string) => {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phoneNumber);
  };

  const validateDateOfBirth = (date: string) => {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dateRegex.test(date)) return false;

    const [day, month, year] = date.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return (
      dateObj.getDate() === day &&
      dateObj.getMonth() === month - 1 &&
      dateObj.getFullYear() === year
    );
  };

  const formatDateInput = (text: string) => {
    const numbersOnly = text.replace(/\D/g, '');
    let formattedDate = '';

    if (numbersOnly.length >= 2) {
      formattedDate = numbersOnly.substring(0, 2) + '/';
    } else {
      formattedDate = numbersOnly;
    }

    if (numbersOnly.length >= 4) {
      formattedDate += numbersOnly.substring(2, 4) + '/';
    } else if (numbersOnly.length > 2) {
      formattedDate += numbersOnly.substring(2);
    }

    if (numbersOnly.length > 4) {
      formattedDate += numbersOnly.substring(4, 8);
    }

    return formattedDate;
  };

  const handleDateChange = (text: string) => {
    const formatted = formatDateInput(text);
    setDateOfBirth(formatted);

    if (formatted.length === 10) {
      if (!validateDateOfBirth(formatted)) {
        setErrors(prev => ({
          ...prev,
          dateOfBirth: 'Please enter a valid date',
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          dateOfBirth: '',
        }));
      }
    } else {
      setErrors(prev => ({
        ...prev,
        dateOfBirth: '',
      }));
    }
  };

  const handleChange = () => {
    setErrors({ phone: '', dateOfBirth: '' });
    let hasError = false;

    if (!validatePhone(phone)) {
      setErrors(prev => ({
        ...prev,
        phone: 'Please enter a valid Vietnamese phone number',
      }));
      hasError = true;
    }

    if (!validateDateOfBirth(dateOfBirth)) {
      setErrors(prev => ({
        ...prev,
        dateOfBirth: 'Please enter a valid date (dd/mm/yyyy)',
      }));
      hasError = true;
    }

    if (hasError) {
      return;
    }

    dispatch(updateUserInfo({
      name: name.trim(),
      phone: phone.trim(),
      dateOfBirth: dateOfBirth.trim(),
    }));

    router.replace('/settings');
  };

  return (
    <ScreenWrapper scrollable>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/settings')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal information</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            autoCapitalize="words"
            returnKeyType="next"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={[styles.input, errors.phone ? styles.inputError : null]}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone"
            keyboardType="phone-pad"
            maxLength={10}
            returnKeyType="next"
          />
          {errors.phone ? (
            <Text style={styles.errorText}>{errors.phone}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date of birth</Text>
          <TextInput
            style={[styles.input, errors.dateOfBirth ? styles.inputError : null]}
            value={dateOfBirth}
            onChangeText={handleDateChange}
            placeholder="DD/MM/YYYY"
            keyboardType="numeric"
            maxLength={10}
            returnKeyType="done"
          />
          {errors.dateOfBirth ? (
            <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.changeButton}
          onPress={handleChange}
        >
          <Text style={styles.changeButtonText}>Change</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerRight: {
    width: 40,
  },
  form: {
    paddingTop: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  changeButton: {
    backgroundColor: '#3975F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#3975F6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  changeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PersonalInformationScreen; 