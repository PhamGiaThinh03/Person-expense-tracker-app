import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { clearUserInfo } from '../Redux/Slices/userSlice';

const SettingScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.user.userInfo);

  const handleSignOut = () => {
    dispatch(clearUserInfo());
    setIsModalVisible(false);
    router.push('/onboarding');
  };

  const navigateToPersonalInfo = () => {
    router.push('/personal-information');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.mainContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push('/home')} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Setting</Text>
            <View style={styles.headerRight} />
          </View>

          {/* User Info Section */}
          <TouchableOpacity 
            style={styles.userInfoContainer}
            onPress={navigateToPersonalInfo}
          >
            <View style={styles.avatarContainer}>
              <Ionicons name="person-circle-outline" size={60} color="#666" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{userInfo?.name || 'User name'}</Text>
              <Text style={styles.userPhone}>{userInfo?.phone || ''}</Text>
            </View>
          </TouchableOpacity>

          {/* Sign Out Button */}
          <TouchableOpacity 
            style={styles.signOutContainer}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.signOutText}>Sign out</Text>
          </TouchableOpacity>

          {/* Sign Out Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {/* Close Button */}
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>

                {/* Modal Body */}
                <View style={styles.modalBody}>
                  <View style={styles.infoIconContainer}>
                    <Ionicons name="information-circle" size={40} color="#3975F6" />
                  </View>
                  <Text style={styles.modalTitle}>Do you want to sign out?</Text>
                  <Text style={styles.modalSubtitle}>Your login session will end.</Text>
                  {/* Sign Out Button */}
                  <TouchableOpacity
                    style={styles.signOutButton}
                    onPress={handleSignOut}
                  >
                    <Text style={styles.signOutButtonText}>Sign out</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>

      {/* Bottom Navigation Icons */}
      <View style={styles.bottomNavIcons}>
        <TouchableOpacity accessibilityLabel="Home" onPress={() => router.push('/home')}>
          <Ionicons name="home-outline" size={28} color="#666" style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity accessibilityLabel="Statistics" onPress={() => router.push('/chart')}>
          <Ionicons name="stats-chart" size={28} color="#666" style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity accessibilityLabel="Settings" onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={28} color="#2F80ED" style={styles.navIcon} />
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
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  mainContent: {
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 480,
    width: "100%",
    paddingTop: Platform.OS === "ios" ? 16 : 32,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginHorizontal: -16, // Compensate for ScreenWrapper padding
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
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  avatarContainer: {
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
  },
  signOutContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  signOutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 340,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  modalBody: {
    alignItems: 'center',
    marginTop: 8,
  },
  infoIconContainer: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  signOutButton: {
    backgroundColor: '#3975F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
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

export default SettingScreen; 