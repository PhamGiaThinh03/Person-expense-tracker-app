import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setSelectedIncomeType } from '../Redux/Slices/financialSlice';
import { Ionicons } from '@expo/vector-icons';
import AddCustomCategoryModal from '../Components/AddCustomCategoryModal';

const defaultIncomeTypes = [
  { id: 'salary', title: 'Salary' },
  { id: 'business', title: 'Business' },
  { id: 'gifts', title: 'Gifts' },
  { id: 'others', title: 'Others' }
];

export default function SelectIncomeScreen() {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSelectIncomeType = (type: string) => {
    if (type === 'Others') {
      setIsModalVisible(true);
    } else {
      dispatch(setSelectedIncomeType(type));
      router.push('/add-income');
    }
  };

  const handleAddNewIncomeType = (newIncomeType: string) => {
    dispatch(setSelectedIncomeType(newIncomeType));
    router.push('/add-income');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.push('/add-income')}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#1e1e1e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select income</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.incomeList}>
          {defaultIncomeTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={styles.incomeItem}
              onPress={() => handleSelectIncomeType(type.title)}
            >
              <View style={styles.iconContainer}>
                <Ionicons 
                  name={type.id === 'others' ? 'add-circle-outline' : 'trending-up'} 
                  size={20} 
                  color="#4B7BF5" 
                />
              </View>
              <Text style={styles.incomeText}>{type.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <AddCustomCategoryModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onAdd={handleAddNewIncomeType}
          title="Add Custom Income"
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e1e1e',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  incomeList: {
    gap: 12,
  },
  incomeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  incomeText: {
    fontSize: 16,
    color: '#1e1e1e',
    fontWeight: '500',
  },
}); 