import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../Redux/Slices/userSlice';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const SettingScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const userInfo = useSelector(selectUserInfo);

  const handlePersonalInfo = () => {
    navigation.navigate('PersonalInformation');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <Text style={styles.title}>Setting</Text>
      
      <View style={styles.userCard}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle-outline" size={80} color="#666" />
        </View>
        <Text style={styles.userName}>{userInfo?.name || 'Your name'}</Text>
        <Text style={styles.userPhone}>{userInfo?.phone || 'Your phone number'}</Text>
      </View>

      <View style={styles.accountSettings}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        <TouchableOpacity
          style={styles.menuItem}
          onPress={handlePersonalInfo}
          activeOpacity={0.7}
        >
          <Text style={styles.menuText}>Personal Information</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          activeOpacity={0.7}
        >
          <Text style={styles.menuText}>Sign out</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: Platform.OS === 'android' ? 16 : 0,
    marginBottom: 24,
  },
  userCard: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 16,
    color: '#666',
  },
  accountSettings: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
  },
});

export default SettingScreen; 