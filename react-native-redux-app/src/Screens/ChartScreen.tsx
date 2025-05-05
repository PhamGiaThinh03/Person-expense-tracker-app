import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import { LineChart } from 'react-native-chart-kit';
import DropDownPicker from 'react-native-dropdown-picker';
import dayjs from 'dayjs';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { RootState } from '../Redux/store';
import { router } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DailyExpense {
  date: string;
  total: number;
}

const ChartScreen = () => {
  const router = useRouter();
  const transactions = useSelector((state: RootState) => state.financial.transactions);
  
  const [open, setOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'));
  const [selectedDate, setSelectedDate] = useState('');
  const [showDateInput, setShowDateInput] = useState(false);
  const [dateError, setDateError] = useState('');
  const [months, setMonths] = useState([
    { label: 'January 2025', value: '2025-01' },
    { label: 'February 2025', value: '2025-02' },
    { label: 'March 2025', value: '2025-03' },
    { label: 'April 2025', value: '2025-04' },
    { label: 'May 2025', value: '2025-05' },
    { label: 'June 2025', value: '2025-06' },
  ]);

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

  const validateDate = (dateString: string) => {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dateRegex.test(dateString)) {
      setDateError('Please enter date in DD/MM/YYYY format');
      return false;
    }

    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      setDateError('Please enter a valid date');
      return false;
    }

    setDateError('');
    return true;
  };

  const handleDateChange = (text: string) => {
    const formattedDate = formatDateInput(text);
    setSelectedDate(formattedDate);
    
    if (formattedDate.length === 10) {
      validateDate(formattedDate);
    } else {
      setDateError('');
    }
  };

  // Filter transactions for selected month and calculate daily expenses
  const getDailyExpenses = (): DailyExpense[] => {
    const filteredTransactions = transactions.filter(
      (t) => 
        t.type === 'expense' && 
        t.date.startsWith(selectedMonth)
    );

    const dailyTotals: { [key: string]: number } = {};
    
    filteredTransactions.forEach((t) => {
      const day = t.date;
      dailyTotals[day] = (dailyTotals[day] || 0) + t.amount;
    });

    const daysInMonth = dayjs(selectedMonth).daysInMonth();
    const allDays: DailyExpense[] = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const day = dayjs(`${selectedMonth}-${String(i).padStart(2, '0')}`);
      const dateStr = day.format('YYYY-MM-DD');
      allDays.push({
        date: dateStr,
        total: dailyTotals[dateStr] || 0,
      });
    }

    return allDays;
  };

  const getFilteredTransactions = () => {
    if (!selectedDate) {
      return transactions
        .filter(t => t.date.startsWith(selectedMonth))
        .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
    }

    const [day, month, year] = selectedDate.split('/');
    const formattedDate = `${year}-${month}-${day}`;
    
    return transactions
      .filter(t => t.date === formattedDate)
      .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
  };

  const dailyExpenses = getDailyExpenses();
  const filteredTransactions = getFilteredTransactions();
  
  // Prepare data for the chart
  // Chỉ hiển thị các ngày 1, 5, 10, 15, 20, 25, 30 (nếu có)
  const daysInMonth = dayjs(selectedMonth).daysInMonth();
  const labelIndexes = [0, 4, 9, 14, 19, 24, 29].filter(i => i < daysInMonth);

  const chartData = {
    labels: dailyExpenses.map((d, i) =>
      labelIndexes.includes(i) ? dayjs(d.date).format('DD') : ''
    ),
    datasets: [{
      data: dailyExpenses.map(d => d.total),
    }],
  };

  // Calculate total expense for the month
  const monthlyTotal = dailyExpenses.reduce((sum, day) => sum + day.total, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/home')} style={{ position: 'absolute', left: 16, zIndex: 1 }}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.monthLabel}>Report chart</Text>
        
        <DropDownPicker
          open={open}
          value={selectedMonth}
          items={months}
          setOpen={setOpen}
          setValue={setSelectedMonth}
          setItems={setMonths}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          listItemContainerStyle={styles.dropdownItem}
          placeholder="Select month"
        />

        <Text style={styles.totalAmount}>
          -{monthlyTotal.toLocaleString('vi-VN')} đ
        </Text>

        <LineChart
          data={chartData}
          width={SCREEN_WIDTH - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(47, 128, 237, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        />

        <View style={styles.transactionList}>
          <View style={styles.transactionHeader}>
            <Text style={styles.transactionTitle}>Transaction history</Text>
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowDateInput(!showDateInput)}
            >
              <Text style={styles.dateInputText}>
                {selectedDate || 'Date'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {showDateInput && (
            <View style={styles.dateInputContainer}>
              <TextInput
                style={styles.dateTextInput}
                value={selectedDate}
                onChangeText={handleDateChange}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#666"
                maxLength={10}
                keyboardType="numeric"
              />
              {dateError ? (
                <Text style={styles.errorText}>{dateError}</Text>
              ) : null}
            </View>
          )}

          {filteredTransactions.map(transaction => (
            <TouchableOpacity
              key={transaction.id}
              style={styles.transactionItem}
              onPress={() => router.push({
                pathname: '/EditTransactionScreen',
                params: {
                  id: transaction.id,
                  type: transaction.type,
                  title: transaction.title,
                  amount: transaction.amount,
                  date: transaction.date,
                }
              })}
            >
              <View style={styles.transactionLeft}>
                <View style={[
                  styles.transactionIcon,
                  transaction.type === 'expense' ? styles.expenseIcon : styles.incomeIcon
                ]}>
                  <Ionicons
                    name={transaction.type === 'expense' ? 'arrow-down' : 'arrow-up'}
                    size={20}
                    color={transaction.type === 'expense' ? '#EB5757' : '#2F80ED'}
                  />
                </View>
                <View>
                  <Text style={styles.transactionItemTitle}>{transaction.title}</Text>
                  <Text style={styles.transactionDate}>
                    {dayjs(transaction.date).format('DD.MM.YYYY')}
                  </Text>
                </View>
              </View>
              <Text style={[
                styles.transactionAmount,
                transaction.type === 'expense' ? styles.expenseText : styles.incomeText
              ]}>
                {transaction.type === 'expense' ? '- ' : '+ '}
                {transaction.amount.toLocaleString('vi-VN')} đ
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bottom Navigation Icons */}
      <View style={styles.bottomNavIcons}>
        <TouchableOpacity accessibilityLabel="Home" onPress={() => router.push('/home')}>
          <Ionicons name="home-outline" size={28} color="#666" style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity accessibilityLabel="Statistics" onPress={() => router.push('/chart')}>
          <Ionicons name="stats-chart" size={28} color="#2F80ED" style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity accessibilityLabel="Settings" onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={28} color="#666" style={styles.navIcon} />
        </TouchableOpacity>
      </View>

      {/* Home Indicator */}
      {Platform.OS === "ios" && (
        <View style={styles.homeIndicatorContainer}>
          <View style={styles.homeIndicator} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  monthLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  dropdown: {
    borderColor: '#E0E0E0',
    marginBottom: 16,
  },
  dropdownContainer: {
    borderColor: '#E0E0E0',
  },
  dropdownItem: {
    padding: 8,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: '600',
    color: '#EB5757',
    marginBottom: 24,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  transactionList: {
    marginTop: 24,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  dateInputText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  dateInputContainer: {
    marginBottom: 16,
  },
  dateTextInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
  },
  errorText: {
    color: '#EB5757',
    fontSize: 12,
    marginTop: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseIcon: {
    backgroundColor: '#FFEBEE',
  },
  incomeIcon: {
    backgroundColor: '#E3F2FD',
  },
  transactionItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '500',
  },
  expenseText: {
    color: '#EB5757',
  },
  incomeText: {
    color: '#2F80ED',
  },
  bottomNavIcons: {
    alignSelf: "center",
    display: "flex",
    marginTop: 39,
    flexDirection: "row",
    alignItems: "center",
    gap: 102,
  },
  navIcon: {
    aspectRatio: 1,
    width: 28,
    height: 28,
  },
  homeIndicatorContainer: {
    display: "flex",
    width: "100%",
    paddingHorizontal: 80,
    paddingTop: 30,
    paddingBottom: Platform.OS === "ios" ? 8 : 0,
    flexDirection: "column",
    alignItems: "center",
  },
  homeIndicator: {
    borderRadius: 100,
    width: 144,
    height: 5,
    backgroundColor: "#E0E0E0",
  },
});

export default ChartScreen; 