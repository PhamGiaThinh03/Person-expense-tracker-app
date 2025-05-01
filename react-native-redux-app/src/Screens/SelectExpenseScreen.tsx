import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { setSelectedExpenseType } from '../Redux/Slices/financialSlice';
import AddCustomCategoryModal from '../Components/AddCustomCategoryModal';

const expenseTypes = [
  'Food & Drink',
  'Shopping',
  'Transportation',
  'Bills & Utilities',
  'Others',
];

export default function SelectExpenseScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSelectExpense = (type: string) => {
    if (type === 'Others') {
      setIsModalVisible(true);
    } else {
      dispatch(setSelectedExpenseType(type));
      router.push('/add-expense');
    }
  };

  const handleAddNewExpenseType = (newExpenseType: string) => {
    dispatch(setSelectedExpenseType(newExpenseType));
    router.push('/add-expense');
  };

  const renderIcon = (type: string) => {
    if (type === 'Others') {
      return (
        <View style={styles.iconContainer}>
          <Ionicons 
            name="add-circle-outline" 
            size={20} 
            color="#EB5757" 
          />
        </View>
      );
    }
    return (
      <View style={styles.iconContainer}>
        <MaterialIcons name="arrow-downward" size={20} color="#EB5757" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Select expense</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Expense</Text>
        {expenseTypes.map((type, index) => (
          <TouchableOpacity
            key={index}
            style={styles.expenseItem}
            onPress={() => handleSelectExpense(type)}
          >
            <View style={styles.expenseLeft}>
              <View style={styles.expenseIcon}>
                {renderIcon(type)}
              </View>
              <Text style={styles.expenseText}>{type}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <AddCustomCategoryModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onAdd={handleAddNewExpenseType}
          title="Add Custom Expense"
        />
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
    color: '#60708F',
    marginBottom: 16,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 12,
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseText: {
    fontSize: 16,
    color: '#000000',
  },
}); 